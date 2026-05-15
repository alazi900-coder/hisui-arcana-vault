import type { Move, Pokemon, Stats } from "@/types/pokemon";

export type StatusCondition = "none" | "burn" | "paralysis" | "poison" | "sleep" | "freeze";

export type StatStageKey = keyof Stats;

export type BattleSide = "player" | "opponent";

export interface BattleCombatant {
  /** The full Pokémon record (read-only — engine never mutates this). */
  pokemon: Pokemon;
  /** Move ids the trainer picked for this combatant (max 4). */
  movesetIds: string[];
  level: number;
  currentHp: number;
  maxHp: number;
  /** Stat stages, clamped to [-6, +6]. */
  statStages: Record<StatStageKey, number>;
  status: StatusCondition;
  /**
   * Volatile flags. Sleep/freeze use this to track remaining turns; absent
   * keys mean the flag isn't active.
   */
  flags: {
    sleepTurns?: number;
    flinch?: boolean;
  };
}

export interface BattleLogEntry {
  turn: number;
  side?: BattleSide;
  kind: "attack" | "effective" | "critical" | "miss" | "faint" | "status" | "info";
  text_ar: string;
  text_en: string;
}

export type BattleOutcome = "ongoing" | "player_won" | "opponent_won" | "draw";

export interface BattleState {
  player: BattleCombatant;
  opponent: BattleCombatant;
  turn: number;
  log: BattleLogEntry[];
  outcome: BattleOutcome;
}

export interface DamageInput {
  attacker: BattleCombatant;
  defender: BattleCombatant;
  move: Move;
  /** Random factor producer in [0.85, 1.0]. Provided so callers can pin it for tests. */
  rng?: () => number;
  /** Force critical hit (testing). */
  forceCritical?: boolean;
}

export interface DamageResult {
  damage: number;
  effectiveness: number;
  critical: boolean;
  missed: boolean;
  /** True for status moves or 0-power moves. */
  noDirectDamage: boolean;
}
