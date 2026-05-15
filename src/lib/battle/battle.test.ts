import { describe, expect, it } from "vitest";
import type { Move, Pokemon } from "@/types/pokemon";
import { calculateBattleDamage, statStageMultiplier, turnOrder, typeEffectiveness } from "./damage";
import { applyMove, computeMaxHp, executeTurn, makeCombatant, newBattle } from "./engine";

const baseImages = { thumb: "", artwork: "" };

const mkPokemon = (overrides: Partial<Pokemon> = {}): Pokemon => ({
  id: "tester",
  dex_no: 1,
  name_ar: "بوكي",
  name_en: "Tester",
  types: ["normal"],
  tags: [],
  stats: { hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 80 },
  description_ar: "",
  description_en: "",
  evolutions: [],
  images: baseImages,
  learnset: [],
  spawn_refs: [],
  ...overrides,
});

const mkMove = (overrides: Partial<Move> = {}): Move => ({
  id: "tackle",
  name_ar: "اصطدام",
  name_en: "Tackle",
  type: "normal",
  category: "physical",
  power: 40,
  accuracy: 100,
  pp: 35,
  description_ar: "",
  description_en: "",
  ...overrides,
});

/** A deterministic RNG built from an array of pre-canned values. */
const rngFrom = (values: number[]): (() => number) => {
  let i = 0;
  return () => {
    const v = values[i % values.length];
    i += 1;
    return v;
  };
};

describe("typeEffectiveness", () => {
  it("returns 2 for super-effective single-type matchups", () => {
    expect(typeEffectiveness("fire", ["grass"])).toBe(2);
    expect(typeEffectiveness("water", ["fire"])).toBe(2);
  });

  it("compounds against dual types (4x and 0)", () => {
    expect(typeEffectiveness("ice", ["dragon", "flying"])).toBe(4);
    expect(typeEffectiveness("electric", ["ground", "flying"])).toBe(0);
  });

  it("returns 1 for neutral matchups", () => {
    expect(typeEffectiveness("normal", ["normal"])).toBe(1);
  });
});

describe("statStageMultiplier", () => {
  it("returns 1.0 at stage 0", () => {
    expect(statStageMultiplier(0)).toBe(1);
  });

  it("scales to 2.0 at +2 and to 0.5 at -2", () => {
    expect(statStageMultiplier(2)).toBe(2);
    expect(statStageMultiplier(-2)).toBe(0.5);
  });

  it("clamps to the [-6, +6] range", () => {
    expect(statStageMultiplier(10)).toBe(statStageMultiplier(6));
    expect(statStageMultiplier(-10)).toBe(statStageMultiplier(-6));
  });
});

describe("calculateBattleDamage", () => {
  const attacker = makeCombatant(mkPokemon(), 50, []);
  const defender = makeCombatant(mkPokemon(), 50, []);

  it("returns no damage for status moves", () => {
    const res = calculateBattleDamage({
      attacker,
      defender,
      move: mkMove({ category: "status", power: undefined }),
      rng: rngFrom([0.5]),
    });
    expect(res).toMatchObject({ damage: 0, noDirectDamage: true, missed: false });
  });

  it("returns 0 damage for type-immune targets", () => {
    const ghostDefender = makeCombatant(mkPokemon({ types: ["ghost"] }), 50, []);
    const res = calculateBattleDamage({
      attacker,
      defender: ghostDefender,
      move: mkMove(),
      rng: rngFrom([0.5]),
      forceCritical: false,
    });
    expect(res.effectiveness).toBe(0);
    expect(res.damage).toBe(0);
  });

  it("applies STAB and super-effective multipliers", () => {
    const fireAttacker = makeCombatant(mkPokemon({ types: ["fire"] }), 50, []);
    const grassDefender = makeCombatant(mkPokemon({ types: ["grass"] }), 50, []);
    const fireMove = mkMove({ name_en: "Ember", type: "fire", power: 40 });

    const res = calculateBattleDamage({
      attacker: fireAttacker,
      defender: grassDefender,
      move: fireMove,
      rng: rngFrom([1, 1]),
      forceCritical: false,
    });
    expect(res.effectiveness).toBe(2);
    expect(res.damage).toBeGreaterThan(0);
  });

  it("registers misses when accuracy roll fails", () => {
    const res = calculateBattleDamage({
      attacker,
      defender,
      move: mkMove({ accuracy: 50 }),
      rng: rngFrom([0.9]),
      forceCritical: false,
    });
    expect(res.missed).toBe(true);
    expect(res.damage).toBe(0);
  });

  it("marks critical hits when forced", () => {
    const res = calculateBattleDamage({
      attacker,
      defender,
      move: mkMove(),
      rng: rngFrom([1]),
      forceCritical: true,
    });
    expect(res.critical).toBe(true);
  });
});

describe("turnOrder", () => {
  const fast = makeCombatant(mkPokemon({ stats: { hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 200 } }), 50, []);
  const slow = makeCombatant(mkPokemon({ stats: { hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 40 } }), 50, []);

  it("higher priority wins regardless of speed", () => {
    expect(
      turnOrder(
        { c: slow, move: mkMove({ priority: 1 }) },
        { c: fast, move: mkMove({ priority: 0 }) },
        () => true,
      ),
    ).toBe("player");
  });

  it("faster speed wins when priority is equal", () => {
    expect(
      turnOrder(
        { c: fast, move: mkMove() },
        { c: slow, move: mkMove() },
        () => true,
      ),
    ).toBe("player");
  });

  it("paralysis halves effective speed", () => {
    const paralyzedFast = { ...fast, status: "paralysis" as const };
    expect(
      turnOrder(
        { c: paralyzedFast, move: mkMove() },
        { c: slow, move: mkMove() },
        () => false,
      ),
    ).toBe("player");
  });
});

describe("computeMaxHp", () => {
  it("scales with level", () => {
    const p = mkPokemon({ stats: { hp: 100, atk: 80, def: 80, spa: 80, spd: 80, spe: 80 } });
    expect(computeMaxHp(p, 1)).toBe(12);
    expect(computeMaxHp(p, 50)).toBeGreaterThan(computeMaxHp(p, 25));
    expect(computeMaxHp(p, 100)).toBeGreaterThan(computeMaxHp(p, 50));
  });
});

describe("applyMove", () => {
  it("reduces defender HP and logs a faint when HP hits 0", () => {
    const attacker = makeCombatant(mkPokemon({ stats: { hp: 80, atk: 200, def: 80, spa: 80, spd: 80, spe: 80 } }), 100, []);
    const defender: ReturnType<typeof makeCombatant> = {
      ...makeCombatant(mkPokemon({ stats: { hp: 10, atk: 80, def: 1, spa: 80, spd: 80, spe: 80 } }), 100, []),
      currentHp: 5,
    };

    const result = applyMove(1, "player", attacker, defender, mkMove({ power: 100 }), rngFrom([1, 1]), false);
    expect(result.defender.currentHp).toBe(0);
    expect(result.log.some(l => l.kind === "faint")).toBe(true);
  });
});

describe("executeTurn integration", () => {
  it("ends the battle when the opponent faints", () => {
    const player = mkPokemon({ id: "p1", stats: { hp: 80, atk: 250, def: 80, spa: 80, spd: 80, spe: 200 } });
    const opponent = mkPokemon({ id: "p2", stats: { hp: 5, atk: 80, def: 1, spa: 80, spd: 80, spe: 40 } });

    const state = newBattle({
      player: { pokemon: player, level: 100, movesetIds: ["tackle"] },
      opponent: { pokemon: opponent, level: 100, movesetIds: ["tackle"] },
    });

    const after = executeTurn(state, {
      playerMove: mkMove({ power: 200, accuracy: 100 }),
      opponentMove: mkMove({ power: 1 }),
      rng: rngFrom([1, 1]),
    });

    expect(after.outcome).toBe("player_won");
    expect(after.opponent.currentHp).toBe(0);
    // Opponent never got to move because they fainted first.
    expect(after.player.currentHp).toBe(after.player.maxHp);
  });

  it("respects move priority — slower Pokémon with +1 priority strikes first", () => {
    const slowAttacker = mkPokemon({ id: "p1", stats: { hp: 80, atk: 250, def: 80, spa: 80, spd: 80, spe: 1 } });
    const fastOpponent = mkPokemon({ id: "p2", stats: { hp: 5, atk: 80, def: 1, spa: 80, spd: 80, spe: 999 } });

    const state = newBattle({
      player: { pokemon: slowAttacker, level: 100, movesetIds: [] },
      opponent: { pokemon: fastOpponent, level: 100, movesetIds: [] },
    });

    const after = executeTurn(state, {
      playerMove: mkMove({ priority: 1, power: 200 }),
      opponentMove: mkMove({ power: 1 }),
      rng: rngFrom([1, 1]),
    });

    expect(after.outcome).toBe("player_won");
  });
});
