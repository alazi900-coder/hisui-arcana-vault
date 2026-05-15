import type { Move, Pokemon } from "@/types/pokemon";
import { calculateBattleDamage, turnOrder } from "./damage";
import type {
  BattleCombatant,
  BattleLogEntry,
  BattleSide,
  BattleState,
  StatStageKey,
} from "./types";

/**
 * Compute a battle HP value for a Pokémon at a given level using a simplified
 * generation-style formula with neutral nature, no IVs/EVs:
 *
 *   HP = floor((2 * base + 50) * level / 100) + 10
 *
 * This produces familiar mid-game numbers without exposing IV/EV configuration
 * in the UI. Other stats use the analogous formula without the +10 / +50 bias.
 */
export function computeMaxHp(p: Pokemon, level: number): number {
  return Math.floor(((2 * p.stats.hp + 50) * level) / 100) + 10;
}

const ZERO_STAGES: Record<StatStageKey, number> = {
  hp: 0,
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
};

export function makeCombatant(pokemon: Pokemon, level: number, movesetIds: string[]): BattleCombatant {
  const maxHp = computeMaxHp(pokemon, level);
  return {
    pokemon,
    movesetIds: movesetIds.slice(0, 4),
    level,
    currentHp: maxHp,
    maxHp,
    statStages: { ...ZERO_STAGES },
    status: "none",
    flags: {},
  };
}

export interface NewBattleInput {
  player: { pokemon: Pokemon; level: number; movesetIds: string[] };
  opponent: { pokemon: Pokemon; level: number; movesetIds: string[] };
}

export function newBattle(input: NewBattleInput): BattleState {
  const player = makeCombatant(input.player.pokemon, input.player.level, input.player.movesetIds);
  const opponent = makeCombatant(input.opponent.pokemon, input.opponent.level, input.opponent.movesetIds);
  return {
    player,
    opponent,
    turn: 0,
    outcome: "ongoing",
    log: [
      {
        turn: 0,
        kind: "info",
        text_ar: `بدأ القتال بين ${player.pokemon.name_ar} و ${opponent.pokemon.name_ar}`,
        text_en: `Battle started: ${player.pokemon.name_en} vs ${opponent.pokemon.name_en}`,
      },
    ],
  };
}

interface ApplyMoveResult {
  attacker: BattleCombatant;
  defender: BattleCombatant;
  log: BattleLogEntry[];
}

/**
 * Apply a single move from `attacker` to `defender`, producing fresh copies of
 * both combatants (engine is immutable) plus a flat log slice. Critical hits,
 * accuracy and damage rolls are driven by the optional rng for testability.
 */
export function applyMove(
  turn: number,
  side: BattleSide,
  attacker: BattleCombatant,
  defender: BattleCombatant,
  move: Move,
  rng?: () => number,
  forceCritical?: boolean,
): ApplyMoveResult {
  const log: BattleLogEntry[] = [];
  const attackerName = side === "player" ? attacker.pokemon.name_en : `Foe ${attacker.pokemon.name_en}`;
  const attackerNameAr = side === "player" ? attacker.pokemon.name_ar : `العدو ${attacker.pokemon.name_ar}`;

  log.push({
    turn,
    side,
    kind: "attack",
    text_ar: `${attackerNameAr} استخدم ${move.name_ar}!`,
    text_en: `${attackerName} used ${move.name_en}!`,
  });

  const result = calculateBattleDamage({ attacker, defender, move, rng, forceCritical });

  if (result.missed) {
    log.push({
      turn,
      side,
      kind: "miss",
      text_ar: "ولكنّها أخطأت!",
      text_en: "But it missed!",
    });
    return { attacker, defender, log };
  }

  if (result.noDirectDamage) {
    log.push({
      turn,
      side,
      kind: "info",
      text_ar: "(حركة حالة — لم يُسبَّب ضرر)",
      text_en: "(Status move — no damage dealt)",
    });
    return { attacker, defender, log };
  }

  if (result.critical) {
    log.push({ turn, side, kind: "critical", text_ar: "ضربة قاضية!", text_en: "A critical hit!" });
  }
  if (result.effectiveness > 1) {
    log.push({
      turn,
      side,
      kind: "effective",
      text_ar: "إنّها فعّالة جداً!",
      text_en: "It's super effective!",
    });
  } else if (result.effectiveness > 0 && result.effectiveness < 1) {
    log.push({
      turn,
      side,
      kind: "effective",
      text_ar: "إنّها ليست فعّالة جداً…",
      text_en: "It's not very effective…",
    });
  } else if (result.effectiveness === 0) {
    log.push({
      turn,
      side,
      kind: "effective",
      text_ar: "ليس لها أي تأثير…",
      text_en: "It had no effect…",
    });
  }

  const newDefender: BattleCombatant = {
    ...defender,
    currentHp: Math.max(0, defender.currentHp - result.damage),
  };

  if (newDefender.currentHp === 0) {
    log.push({
      turn,
      side,
      kind: "faint",
      text_ar: `${defender.pokemon.name_ar} غُلب!`,
      text_en: `${defender.pokemon.name_en} fainted!`,
    });
  }

  return { attacker, defender: newDefender, log };
}

export interface TurnInput {
  playerMove: Move;
  opponentMove: Move;
  rng?: () => number;
  /** When provided, used to decide priority/speed ties (true = player first). */
  tieBreak?: () => boolean;
}

/**
 * Execute a full turn (both moves, faint check after each). Returns the next
 * BattleState. Pure: never mutates the input.
 */
export function executeTurn(state: BattleState, input: TurnInput): BattleState {
  if (state.outcome !== "ongoing") return state;

  const turn = state.turn + 1;
  const first = turnOrder(
    { c: state.player, move: input.playerMove },
    { c: state.opponent, move: input.opponentMove },
    input.tieBreak,
  );

  let player = state.player;
  let opponent = state.opponent;
  const log: BattleLogEntry[] = [];

  const runPlayer = () => {
    if (player.currentHp === 0 || opponent.currentHp === 0) return;
    const r = applyMove(turn, "player", player, opponent, input.playerMove, input.rng);
    player = r.attacker;
    opponent = r.defender;
    log.push(...r.log);
  };
  const runOpponent = () => {
    if (player.currentHp === 0 || opponent.currentHp === 0) return;
    const r = applyMove(turn, "opponent", opponent, player, input.opponentMove, input.rng);
    opponent = r.attacker;
    player = r.defender;
    log.push(...r.log);
  };

  if (first === "player") {
    runPlayer();
    runOpponent();
  } else {
    runOpponent();
    runPlayer();
  }

  let outcome = state.outcome;
  const playerFainted = player.currentHp === 0;
  const opponentFainted = opponent.currentHp === 0;
  if (playerFainted && opponentFainted) outcome = "draw";
  else if (playerFainted) outcome = "opponent_won";
  else if (opponentFainted) outcome = "player_won";

  return {
    player,
    opponent,
    turn,
    log: [...state.log, ...log],
    outcome,
  };
}
