/**
 * Pokémon Legends: Arceus shiny-odds math.
 *
 * PLA uses a "roll-based" shiny system: each encounter performs N independent
 * shiny rolls at the base rate (1/4096). Various bonuses *add* extra rolls.
 *
 * Outbreak chains (community-verified breakpoints):
 *   0–12   caught   →  +0 rolls
 *   13–19  caught   →  +1 roll
 *   20–24  caught   →  +2 rolls
 *   25–29  caught   →  +3 rolls
 *   30–59  caught   →  +4 rolls   (≥30 is "complete Outbreak research")
 *   60+    caught   →  +5 rolls
 *
 * Massive Mass Outbreaks (Distortion) follow the same table but apply +25
 * rolls at chain ≥ 25 once the MMO multiplier hits. We model that with the
 * `massive` flag.
 *
 * Research level:
 *   "Perfect" (Lv 10) → +1 roll
 *   "Complete" (Lv 4) → +0 rolls  (anything else: no bonus)
 *
 * Shiny Charm → +2 rolls.
 *
 * Final per-encounter probability:
 *
 *   p = 1 - (1 - 1/4096)^totalRolls
 *
 * The "1 in N" string is rendered as 1 / round(1 / p).
 */

export const BASE_RATE = 1 / 4096;

export type ResearchLevel = "none" | "complete" | "perfect";

export interface ShinyOddsInput {
  /** Number of distinct Pokémon caught (or defeated) in the active outbreak chain. */
  outbreakCount: number;
  /** Set true when the outbreak is a Massive Mass Outbreak (Distortion). */
  massive?: boolean;
  /** Player has obtained the Shiny Charm. */
  shinyCharm: boolean;
  /** Pokédex research level for this species. */
  research: ResearchLevel;
}

export interface ShinyOddsResult {
  /** Total number of shiny rolls per encounter (always ≥ 1). */
  rolls: number;
  /** True probability in [0, 1] of a shiny per encounter. */
  probability: number;
  /** Denominator for the familiar "1 / N" display. */
  oneIn: number;
}

/** Pure helper: rolls granted by an outbreak chain count. */
export function outbreakRolls(count: number, massive: boolean = false): number {
  if (count <= 0) return 0;
  // Massive Mass Outbreak: chain ≥ 25 grants the full +25 bonus.
  if (massive) {
    if (count >= 25) return 25;
    if (count >= 13) return Math.min(5, outbreakRolls(count, false) + 2);
    return outbreakRolls(count, false);
  }
  if (count >= 60) return 5;
  if (count >= 30) return 4;
  if (count >= 25) return 3;
  if (count >= 20) return 2;
  if (count >= 13) return 1;
  return 0;
}

/** Pure helper: rolls granted by pokédex research level. */
export function researchRolls(level: ResearchLevel): number {
  switch (level) {
    case "perfect":
      return 1;
    case "complete":
    case "none":
    default:
      return 0;
  }
}

/** Compute the per-encounter shiny odds with all PLA bonuses combined. */
export function computeShinyOdds(input: ShinyOddsInput): ShinyOddsResult {
  const rolls = Math.max(
    1,
    1 +
      outbreakRolls(input.outbreakCount, input.massive ?? false) +
      researchRolls(input.research) +
      (input.shinyCharm ? 2 : 0),
  );
  const probability = 1 - Math.pow(1 - BASE_RATE, rolls);
  const oneIn = Math.max(1, Math.round(1 / probability));
  return { rolls, probability, oneIn };
}

/**
 * Probability of catching at least one shiny across `encounters` attempts.
 * Useful for the tracker to show "after N encounters you've crossed a 50/90/99% threshold".
 */
export function cumulativeShinyChance(rolls: number, encounters: number): number {
  if (encounters <= 0) return 0;
  const perRollFailure = Math.pow(1 - BASE_RATE, rolls);
  return 1 - Math.pow(perRollFailure, encounters);
}

/** Smallest encounter count needed to reach a probability threshold (e.g. 0.5). */
export function encountersForThreshold(rolls: number, threshold: number): number {
  if (threshold <= 0) return 0;
  if (threshold >= 1) return Infinity;
  const perEncounterFailure = Math.pow(1 - BASE_RATE, rolls);
  return Math.ceil(Math.log(1 - threshold) / Math.log(perEncounterFailure));
}
