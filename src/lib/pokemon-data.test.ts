import { describe, expect, it } from "vitest";
import type { Pokemon, PokemonType } from "@/types/pokemon";
import {
  buildLearnedByIndex,
  generateDefaultLearnset,
  inferEvolutionMethod,
  inferEvolutionValue,
} from "./pokemon-data";

const baseImages = { thumb: "", artwork: "" };
const baseStats = { hp: 1, atk: 1, def: 1, spa: 1, spd: 1, spe: 1 };
const empty: Omit<Pokemon, "id" | "dex_no" | "name_ar" | "name_en" | "types" | "tags" | "learnset"> = {
  stats: baseStats,
  description_ar: "",
  description_en: "",
  evolutions: [],
  images: baseImages,
  spawn_refs: [],
};

describe("inferEvolutionMethod", () => {
  it("detects a plain level-up", () => {
    expect(inferEvolutionMethod({ conditions_ar: "المستوى 17", conditions_en: "Level 17" })).toBe("level");
  });

  it("prefers stone over level when both appear", () => {
    expect(
      inferEvolutionMethod({ conditions_ar: "حجر النار", conditions_en: "Use Fire Stone at level 1" }),
    ).toBe("stone");
  });

  it("detects friendship and time triggers", () => {
    expect(inferEvolutionMethod({ conditions_ar: "صداقة عالية", conditions_en: "High Friendship" })).toBe(
      "friendship",
    );
    expect(inferEvolutionMethod({ conditions_ar: "في الليل", conditions_en: "At night" })).toBe("time");
  });

  it("falls back to 'special' when nothing matches", () => {
    expect(inferEvolutionMethod({ conditions_ar: "؟", conditions_en: "Unknown" })).toBe("special");
  });
});

describe("inferEvolutionValue", () => {
  it("returns the embedded number when present", () => {
    expect(inferEvolutionValue({ conditions_ar: "", conditions_en: "Level 36" })).toBe(36);
  });

  it("returns undefined when no number is in the condition", () => {
    expect(inferEvolutionValue({ conditions_ar: "حجر", conditions_en: "Use a stone" })).toBeUndefined();
  });
});

describe("buildLearnedByIndex", () => {
  it("groups Pokémon by move id", () => {
    const pikachu: Pokemon = {
      id: "pikachu",
      dex_no: 25,
      name_ar: "بيكاتشو",
      name_en: "Pikachu",
      types: ["electric"],
      tags: [],
      learnset: [
        { move_id: "thunder-shock", method: "level", level: 1 },
        { move_id: "tackle", method: "level", level: 1 },
      ],
      ...empty,
    };
    const raichu: Pokemon = { ...pikachu, id: "raichu", name_en: "Raichu", learnset: [{ move_id: "tackle", method: "level", level: 1 }] };

    const idx = buildLearnedByIndex([pikachu, raichu]);
    expect(idx.get("thunder-shock")?.map((r) => r.pokemon.id)).toEqual(["pikachu"]);
    expect(idx.get("tackle")?.map((r) => r.pokemon.id)).toEqual(["pikachu", "raichu"]);
    expect(idx.has("missing")).toBe(false);
  });

  it("returns an empty map for an empty roster", () => {
    expect(buildLearnedByIndex([]).size).toBe(0);
  });
});

describe("generateDefaultLearnset", () => {
  const moves = new Set(["tackle", "growl", "ember", "water-gun", "rest", "protect", "leafage", "gust"]);

  it("emits STAB moves for each declared type, in order", () => {
    const types: PokemonType[] = ["grass", "flying"];
    const set = generateDefaultLearnset(types, moves);
    expect(set).toEqual([
      { move_id: "tackle", method: "level", level: 1 },
      { move_id: "growl", method: "level", level: 1 },
      { move_id: "leafage", method: "level", level: 5 },
      { move_id: "gust", method: "level", level: 9 },
      { move_id: "rest", method: "tutor" },
      { move_id: "protect", method: "tutor" },
    ]);
  });

  it("skips moves that are not in the available move database", () => {
    const limited = new Set(["tackle", "rest"]);
    const set = generateDefaultLearnset(["dragon"], limited);
    // dragon's fallback is dragon-breath, which is not in the limited pool.
    expect(set.map((e) => e.move_id)).toEqual(["tackle", "rest"]);
  });

  it("does not produce duplicate moves for mono-type Pokémon", () => {
    const set = generateDefaultLearnset(["fire", "fire"], moves);
    const ids = set.map((e) => e.move_id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
