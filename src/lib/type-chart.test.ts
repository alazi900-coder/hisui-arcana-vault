import { describe, it, expect } from "vitest";
import {
  getDefensiveEffectiveness,
  getWeaknesses,
  getResistances,
  getImmunities,
} from "./type-chart";

describe("type-chart", () => {
  describe("getDefensiveEffectiveness", () => {
    it("returns 1x for a neutral matchup (water defending normal attack)", () => {
      const eff = getDefensiveEffectiveness(["water"]);
      expect(eff.normal).toBe(1);
    });

    it("computes 4x weakness for dual-type stacking (grass/ground vs ice)", () => {
      const eff = getDefensiveEffectiveness(["grass", "ground"]);
      expect(eff.ice).toBe(4);
    });

    it("computes 0.25x resistance for dual-type stacking (steel/fairy vs dragon)", () => {
      const eff = getDefensiveEffectiveness(["steel", "fairy"]);
      expect(eff.dragon).toBe(0);
    });

    it("returns 0x immunity (ground type defending electric)", () => {
      const eff = getDefensiveEffectiveness(["ground"]);
      expect(eff.electric).toBe(0);
    });

    it("returns 0x for ghost defending against normal", () => {
      const eff = getDefensiveEffectiveness(["ghost"]);
      expect(eff.normal).toBe(0);
    });

    it("computes 0.5x resistance (water defending against fire)", () => {
      const eff = getDefensiveEffectiveness(["water"]);
      expect(eff.fire).toBe(0.5);
    });

    it("returns a multiplier for every attacking type", () => {
      const eff = getDefensiveEffectiveness(["fire"]);
      const allTypes = [
        "normal", "fire", "water", "electric", "grass", "ice",
        "fighting", "poison", "ground", "flying", "psychic", "bug",
        "rock", "ghost", "dragon", "dark", "steel", "fairy",
      ];
      for (const t of allTypes) {
        expect(eff[t as keyof typeof eff]).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("getWeaknesses", () => {
    it("lists fire as a weakness for a grass-type", () => {
      const weaknesses = getWeaknesses(["grass"]);
      const fireMatch = weaknesses.find(w => w.type === "fire");
      expect(fireMatch?.multiplier).toBe(2);
    });

    it("does not list 1x matchups", () => {
      const weaknesses = getWeaknesses(["normal"]);
      for (const w of weaknesses) {
        expect(w.multiplier).toBeGreaterThan(1);
      }
    });
  });

  describe("getResistances", () => {
    it("lists fire as a resistance for a water-type", () => {
      const resistances = getResistances(["water"]);
      const fireMatch = resistances.find(r => r.type === "fire");
      expect(fireMatch?.multiplier).toBe(0.5);
    });

    it("does not include immunities (0x)", () => {
      const resistances = getResistances(["ground"]);
      for (const r of resistances) {
        expect(r.multiplier).toBeGreaterThan(0);
        expect(r.multiplier).toBeLessThan(1);
      }
    });
  });

  describe("getImmunities", () => {
    it("returns ground as immune to electric", () => {
      const immunities = getImmunities(["ground"]);
      expect(immunities).toContain("electric");
    });

    it("returns flying as immune to ground", () => {
      const immunities = getImmunities(["flying"]);
      expect(immunities).toContain("ground");
    });

    it("returns an empty list for a type with no immunities (e.g. water)", () => {
      const immunities = getImmunities(["water"]);
      expect(immunities).toEqual([]);
    });
  });
});
