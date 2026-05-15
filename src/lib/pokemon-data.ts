/**
 * Pure helpers that operate on the Pokémon data model.
 *
 * These are intentionally framework-free so they can be reused from React
 * components and from unit tests without pulling in Dexie or the Vite alias
 * runtime.
 */
import type {
  Evolution,
  EvolutionMethod,
  LearnsetEntry,
  Pokemon,
  PokemonType,
} from "@/types/pokemon";

/**
 * Detect a structured evolution method from the bilingual condition strings.
 *
 * The data source stores conditions as free-form text (e.g. "Level 17" or
 * "Use Razor Claw at night"). For UI badges we want a categorical method so
 * we can pick an icon and a colour. Order of checks matters — more specific
 * triggers (stone, item, move) need to win over the generic "level" fallback.
 */
export function inferEvolutionMethod(evo: Pick<Evolution, "conditions_ar" | "conditions_en">): EvolutionMethod {
  const text = `${evo.conditions_ar} ${evo.conditions_en}`.toLowerCase();

  if (/\bstone\b|حجر/.test(text)) return "stone";
  if (/\btrade\b|تبادل/.test(text)) return "trade";
  if (/friend|صداقة|happiness/.test(text)) return "friendship";
  if (/\bmove\b|knows\s|تعلم|حركة/.test(text)) return "move";
  if (/\bnight\b|\bday\b|ليل|نهار|dusk|الفجر/.test(text)) return "time";
  if (/\blocation\b|near\s|at\s|في\s|مكان/.test(text)) return "location";
  if (/\bitem\b|hold|عنصر|تمسك/.test(text)) return "item";
  if (/level|مستوى|lvl/.test(text)) return "level";
  return "special";
}

/**
 * Pull the first integer out of an evolution condition (for "Level 17" → 17).
 * Returns undefined when no integer is present.
 */
export function inferEvolutionValue(evo: Pick<Evolution, "conditions_ar" | "conditions_en">): number | undefined {
  const match = `${evo.conditions_ar} ${evo.conditions_en}`.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

/**
 * Build a map of move_id → list of Pokémon that can learn it.
 *
 * Used by MoveDetails to render the "Learned by" section. The grouping by
 * method is left to the caller so they can sort/render however they want.
 */
export function buildLearnedByIndex(pokemon: Pokemon[]): Map<string, { pokemon: Pokemon; entry: LearnsetEntry }[]> {
  const index = new Map<string, { pokemon: Pokemon; entry: LearnsetEntry }[]>();
  for (const p of pokemon) {
    for (const entry of p.learnset ?? []) {
      const bucket = index.get(entry.move_id);
      const row = { pokemon: p, entry };
      if (bucket) {
        bucket.push(row);
      } else {
        index.set(entry.move_id, [row]);
      }
    }
  }
  return index;
}

/**
 * A small palette of always-available moves used as a fallback for the
 * (currently ~100) Hisui Pokémon that don't have hand-curated learnsets yet.
 *
 * The set is intentionally small — one offensive move per type plus a few
 * universal staples. When richer data lands these defaults are dropped.
 */
const TYPE_FALLBACK_MOVE: Record<PokemonType, string> = {
  normal: "tackle",
  fire: "ember",
  water: "water-gun",
  electric: "thunder-shock",
  grass: "leafage",
  ice: "powder-snow",
  fighting: "rock-smash",
  poison: "poison-sting",
  ground: "mud-shot",
  flying: "gust",
  psychic: "confusion",
  bug: "bug-bite",
  rock: "rock-throw",
  ghost: "astonish",
  dragon: "dragon-breath",
  dark: "bite",
  steel: "metal-claw",
  fairy: "fairy-wind",
};

const UNIVERSAL_TUTOR_MOVES = ["rest", "protect"] as const;

/**
 * Generate a minimal but type-aware default learnset for a Pokémon when no
 * curated data is available. The result is deterministic given the inputs so
 * tests can pin specific moves.
 */
export function generateDefaultLearnset(types: PokemonType[], availableMoveIds: ReadonlySet<string>): LearnsetEntry[] {
  const entries: LearnsetEntry[] = [];
  const seen = new Set<string>();

  const push = (move_id: string, method: LearnsetEntry["method"], level?: number) => {
    if (seen.has(move_id) || !availableMoveIds.has(move_id)) return;
    seen.add(move_id);
    entries.push(level === undefined ? { move_id, method } : { move_id, method, level });
  };

  // Universal starter moves.
  push("tackle", "level", 1);
  push("growl", "level", 1);

  // Type-aware STAB moves at increasing levels.
  types.forEach((type, idx) => {
    const move = TYPE_FALLBACK_MOVE[type];
    if (move) push(move, "level", 5 + idx * 4);
  });

  // Tutor staples.
  for (const tutor of UNIVERSAL_TUTOR_MOVES) push(tutor, "tutor");

  return entries;
}
