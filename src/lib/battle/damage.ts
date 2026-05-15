import type { Move, PokemonType } from "@/types/pokemon";
import type { BattleCombatant, DamageInput, DamageResult, StatStageKey } from "./types";

/**
 * Type matchup table. Mirrors `src/lib/type-chart.ts` but kept local to the
 * battle engine so it can stay self-contained. The two tables are verified
 * to be identical by the test suite.
 */
const CHART: Record<PokemonType, Record<PokemonType, number>> = {
  normal:   { normal:1, fire:1,  water:1,   electric:1,  grass:1,   ice:1,    fighting:1,  poison:1,   ground:1, flying:1,   psychic:1,  bug:1,    rock:0.5, ghost:0,   dragon:1, dark:1,    steel:0.5, fairy:1 },
  fire:     { normal:1, fire:0.5,water:0.5, electric:1,  grass:2,   ice:2,    fighting:1,  poison:1,   ground:1, flying:1,   psychic:1,  bug:2,    rock:0.5, ghost:1,   dragon:0.5,dark:1,    steel:2,   fairy:1 },
  water:    { normal:1, fire:2,  water:0.5, electric:1,  grass:0.5, ice:1,    fighting:1,  poison:1,   ground:2, flying:1,   psychic:1,  bug:1,    rock:2,   ghost:1,   dragon:0.5,dark:1,    steel:1,   fairy:1 },
  electric: { normal:1, fire:1,  water:2,   electric:0.5,grass:0.5, ice:1,    fighting:1,  poison:1,   ground:0, flying:2,   psychic:1,  bug:1,    rock:1,   ghost:1,   dragon:0.5,dark:1,    steel:1,   fairy:1 },
  grass:    { normal:1, fire:0.5,water:2,   electric:1,  grass:0.5, ice:1,    fighting:1,  poison:0.5, ground:2, flying:0.5, psychic:1,  bug:0.5,  rock:2,   ghost:1,   dragon:0.5,dark:1,    steel:0.5, fairy:1 },
  ice:      { normal:1, fire:0.5,water:0.5, electric:1,  grass:2,   ice:0.5,  fighting:1,  poison:1,   ground:2, flying:2,   psychic:1,  bug:1,    rock:1,   ghost:1,   dragon:2, dark:1,    steel:0.5, fairy:1 },
  fighting: { normal:2, fire:1,  water:1,   electric:1,  grass:1,   ice:2,    fighting:1,  poison:0.5, ground:1, flying:0.5, psychic:0.5,bug:0.5,  rock:2,   ghost:0,   dragon:1, dark:2,    steel:2,   fairy:0.5 },
  poison:   { normal:1, fire:1,  water:1,   electric:1,  grass:2,   ice:1,    fighting:1,  poison:0.5, ground:0.5,flying:1,  psychic:1,  bug:1,    rock:0.5, ghost:0.5, dragon:1, dark:1,    steel:0,   fairy:2 },
  ground:   { normal:1, fire:2,  water:1,   electric:2,  grass:0.5, ice:1,    fighting:1,  poison:2,   ground:1, flying:0,   psychic:1,  bug:0.5,  rock:2,   ghost:1,   dragon:1, dark:1,    steel:2,   fairy:1 },
  flying:   { normal:1, fire:1,  water:1,   electric:0.5,grass:2,   ice:1,    fighting:2,  poison:1,   ground:1, flying:1,   psychic:1,  bug:2,    rock:0.5, ghost:1,   dragon:1, dark:1,    steel:0.5, fairy:1 },
  psychic:  { normal:1, fire:1,  water:1,   electric:1,  grass:1,   ice:1,    fighting:2,  poison:2,   ground:1, flying:1,   psychic:0.5,bug:1,    rock:1,   ghost:1,   dragon:1, dark:0,    steel:0.5, fairy:1 },
  bug:      { normal:1, fire:0.5,water:1,   electric:1,  grass:2,   ice:1,    fighting:0.5,poison:0.5, ground:1, flying:0.5, psychic:2,  bug:1,    rock:1,   ghost:0.5, dragon:1, dark:2,    steel:0.5, fairy:0.5 },
  rock:     { normal:1, fire:2,  water:1,   electric:1,  grass:1,   ice:2,    fighting:0.5,poison:1,   ground:0.5,flying:2,  psychic:1,  bug:2,    rock:1,   ghost:1,   dragon:1, dark:1,    steel:0.5, fairy:1 },
  ghost:    { normal:0, fire:1,  water:1,   electric:1,  grass:1,   ice:1,    fighting:1,  poison:1,   ground:1, flying:1,   psychic:2,  bug:1,    rock:1,   ghost:2,   dragon:1, dark:0.5,  steel:1,   fairy:1 },
  dragon:   { normal:1, fire:1,  water:1,   electric:1,  grass:1,   ice:1,    fighting:1,  poison:1,   ground:1, flying:1,   psychic:1,  bug:1,    rock:1,   ghost:1,   dragon:2, dark:1,    steel:0.5, fairy:0 },
  dark:     { normal:1, fire:1,  water:1,   electric:1,  grass:1,   ice:1,    fighting:0.5,poison:1,   ground:1, flying:1,   psychic:2,  bug:1,    rock:1,   ghost:2,   dragon:1, dark:0.5,  steel:1,   fairy:0.5 },
  steel:    { normal:1, fire:0.5,water:0.5, electric:0.5,grass:1,   ice:2,    fighting:1,  poison:1,   ground:1, flying:1,   psychic:1,  bug:1,    rock:2,   ghost:1,   dragon:1, dark:1,    steel:0.5, fairy:2 },
  fairy:    { normal:1, fire:0.5,water:1,   electric:1,  grass:1,   ice:1,    fighting:2,  poison:0.5, ground:1, flying:1,   psychic:1,  bug:1,    rock:1,   ghost:1,   dragon:2, dark:2,    steel:0.5, fairy:1 },
};

export function typeEffectiveness(moveType: PokemonType, defenderTypes: PokemonType[]): number {
  let mult = 1;
  for (const t of defenderTypes) mult *= CHART[moveType][t];
  return mult;
}

/** Multiplier for a stat stage in [-6, 6]. Mirrors the canonical formula. */
export function statStageMultiplier(stage: number): number {
  const clamped = Math.max(-6, Math.min(6, stage));
  return clamped >= 0 ? (2 + clamped) / 2 : 2 / (2 - clamped);
}

const PHYSICAL_ATK: StatStageKey = "atk";
const PHYSICAL_DEF: StatStageKey = "def";
const SPECIAL_ATK: StatStageKey = "spa";
const SPECIAL_DEF: StatStageKey = "spd";

function effectiveStat(
  combatant: BattleCombatant,
  stat: StatStageKey,
): number {
  const base = combatant.pokemon.stats[stat];
  return Math.floor(base * statStageMultiplier(combatant.statStages[stat]));
}

/**
 * Generation-V style damage formula simplified for PLA-style 1v1 battles.
 *
 *   ((2*L/5 + 2) * Power * A / D) / 50 + 2
 *   * critical * stab * type * burn * random
 *
 * Returns 0 damage and `noDirectDamage = true` for status moves or 0-power
 * moves. Accuracy/miss handling is done via the optional rng — when accuracy
 * < 100 the roll happens here too, so the engine can stay deterministic.
 */
export function calculateBattleDamage({
  attacker,
  defender,
  move,
  rng,
  forceCritical,
}: DamageInput): DamageResult {
  if (move.category === "status" || !move.power) {
    return { damage: 0, effectiveness: 1, critical: false, missed: false, noDirectDamage: true };
  }

  const random = rng ?? (() => 0.85 + Math.random() * 0.15);

  // Accuracy check (only roll when accuracy < 100, otherwise always hits).
  const accuracy = move.accuracy ?? 100;
  if (accuracy < 100) {
    const acc = random();
    if (acc * 100 > accuracy) {
      return { damage: 0, effectiveness: 1, critical: false, missed: true, noDirectDamage: false };
    }
  }

  const isPhysical = move.category === "physical";
  const atkStat = isPhysical ? PHYSICAL_ATK : SPECIAL_ATK;
  const defStat = isPhysical ? PHYSICAL_DEF : SPECIAL_DEF;
  const A = effectiveStat(attacker, atkStat);
  const D = effectiveStat(defender, defStat);

  const stab = attacker.pokemon.types.includes(move.type) ? 1.5 : 1;
  const effectiveness = typeEffectiveness(move.type, defender.pokemon.types);

  const critical = forceCritical === true || (forceCritical !== false && random() < 1 / 24);
  const critMult = critical ? 1.5 : 1;

  // Burn halves physical attack.
  const burnMult = isPhysical && attacker.status === "burn" ? 0.5 : 1;
  const damageRoll = random();
  const rollFactor = 0.85 + (damageRoll - 0.85) * (effectiveness === 0 ? 0 : 1);

  const base = ((2 * attacker.level) / 5 + 2) * move.power * (A / D);
  const raw = Math.floor((base / 50 + 2) * critMult * stab * effectiveness * burnMult * Math.max(0.85, Math.min(1, rollFactor)));

  return {
    damage: effectiveness === 0 ? 0 : Math.max(1, raw),
    effectiveness,
    critical,
    missed: false,
    noDirectDamage: false,
  };
}

/** Effective speed accounting for paralysis and Choice Scarf-style mods (not yet implemented). */
export function effectiveSpeed(c: BattleCombatant): number {
  const base = effectiveStat(c, "spe");
  return c.status === "paralysis" ? Math.floor(base / 2) : base;
}

/** Decide which combatant acts first for a given pair of moves. */
export function turnOrder(
  player: { c: BattleCombatant; move: Move },
  opponent: { c: BattleCombatant; move: Move },
  tieBreak: () => boolean = () => Math.random() < 0.5,
): "player" | "opponent" {
  const pPriority = player.move.priority ?? 0;
  const oPriority = opponent.move.priority ?? 0;
  if (pPriority !== oPriority) {
    return pPriority > oPriority ? "player" : "opponent";
  }
  const ps = effectiveSpeed(player.c);
  const os = effectiveSpeed(opponent.c);
  if (ps === os) return tieBreak() ? "player" : "opponent";
  return ps > os ? "player" : "opponent";
}
