import { describe, expect, it } from "vitest";
import {
  BASE_RATE,
  computeShinyOdds,
  cumulativeShinyChance,
  encountersForThreshold,
  outbreakRolls,
  researchRolls,
} from "./shiny-odds";

describe("outbreakRolls", () => {
  it("returns 0 below the +1 threshold", () => {
    expect(outbreakRolls(0)).toBe(0);
    expect(outbreakRolls(12)).toBe(0);
  });

  it("hits each breakpoint", () => {
    expect(outbreakRolls(13)).toBe(1);
    expect(outbreakRolls(20)).toBe(2);
    expect(outbreakRolls(25)).toBe(3);
    expect(outbreakRolls(30)).toBe(4);
    expect(outbreakRolls(60)).toBe(5);
    expect(outbreakRolls(999)).toBe(5);
  });

  it("applies the MMO bonus at chain ≥ 25", () => {
    expect(outbreakRolls(25, true)).toBe(25);
    expect(outbreakRolls(13, true)).toBeGreaterThan(outbreakRolls(13, false));
  });
});

describe("researchRolls", () => {
  it("perfect adds 1 roll, others add 0", () => {
    expect(researchRolls("perfect")).toBe(1);
    expect(researchRolls("complete")).toBe(0);
    expect(researchRolls("none")).toBe(0);
  });
});

describe("computeShinyOdds", () => {
  it("base rate with no bonuses is exactly 1/4096", () => {
    const res = computeShinyOdds({ outbreakCount: 0, shinyCharm: false, research: "none" });
    expect(res.rolls).toBe(1);
    expect(res.probability).toBeCloseTo(BASE_RATE, 12);
    expect(res.oneIn).toBe(4096);
  });

  it("shiny charm + perfect research stack additively (4 rolls total)", () => {
    const res = computeShinyOdds({ outbreakCount: 0, shinyCharm: true, research: "perfect" });
    expect(res.rolls).toBe(4);
    expect(res.oneIn).toBeLessThan(4096);
    expect(res.oneIn).toBeGreaterThan(1000);
  });

  it("max outbreak + charm + perfect = 8 rolls", () => {
    const res = computeShinyOdds({ outbreakCount: 60, shinyCharm: true, research: "perfect" });
    expect(res.rolls).toBe(1 + 5 + 1 + 2);
    expect(res.oneIn).toBeLessThan(600);
  });

  it("clamps rolls to at least 1", () => {
    const res = computeShinyOdds({ outbreakCount: -5, shinyCharm: false, research: "none" });
    expect(res.rolls).toBe(1);
  });

  it("MMO chain ≥ 25 dwarfs normal outbreak", () => {
    const normal = computeShinyOdds({ outbreakCount: 60, shinyCharm: false, research: "none" });
    const mmo = computeShinyOdds({ outbreakCount: 25, shinyCharm: false, research: "none", massive: true });
    expect(mmo.rolls).toBeGreaterThan(normal.rolls);
    expect(mmo.oneIn).toBeLessThan(normal.oneIn);
  });
});

describe("cumulativeShinyChance", () => {
  it("returns 0 for 0 encounters", () => {
    expect(cumulativeShinyChance(1, 0)).toBe(0);
  });

  it("monotonically increases with encounters", () => {
    const a = cumulativeShinyChance(1, 100);
    const b = cumulativeShinyChance(1, 1000);
    const c = cumulativeShinyChance(1, 4096);
    expect(b).toBeGreaterThan(a);
    expect(c).toBeGreaterThan(b);
  });

  it("approaches 1 with many encounters", () => {
    const lots = cumulativeShinyChance(1, 100000);
    expect(lots).toBeGreaterThan(0.999);
    expect(lots).toBeLessThan(1);
  });
});

describe("encountersForThreshold", () => {
  it("returns 0 for a threshold of 0", () => {
    expect(encountersForThreshold(1, 0)).toBe(0);
  });

  it("returns Infinity for an impossible 100% threshold", () => {
    expect(encountersForThreshold(1, 1)).toBe(Infinity);
  });

  it("50% threshold at 1 roll is roughly 2839 (ln(0.5)/ln(4095/4096))", () => {
    const n = encountersForThreshold(1, 0.5);
    expect(n).toBe(2839);
  });

  it("more rolls = fewer encounters to hit a threshold", () => {
    expect(encountersForThreshold(8, 0.5)).toBeLessThan(encountersForThreshold(1, 0.5));
  });
});
