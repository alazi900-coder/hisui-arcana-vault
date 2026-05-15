// PLA Dex X - Data Types

export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type PokemonTag = 
  | 'starter' | 'legendary' | 'mythical' | 'noble' | 'alpha' | 'hisuian';

export type MoveCategory = 'physical' | 'special' | 'status';

export interface Stats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export type EvolutionMethod =
  | 'level'
  | 'item'
  | 'stone'
  | 'trade'
  | 'friendship'
  | 'move'
  | 'time'
  | 'location'
  | 'special';

export interface Evolution {
  to_id: string;
  conditions_ar: string;
  conditions_en: string;
  /**
   * Optional structured trigger inferred from the human-readable conditions.
   * Used by the UI to render method-specific badges and icons.
   */
  method?: EvolutionMethod;
  /** Optional numeric value associated with the method (e.g. level number). */
  value?: number;
}

export type EggGroup =
  | 'monster'
  | 'water1'
  | 'water2'
  | 'water3'
  | 'bug'
  | 'flying'
  | 'field'
  | 'fairy'
  | 'grass'
  | 'humanlike'
  | 'mineral'
  | 'amorphous'
  | 'dragon'
  | 'ditto'
  | 'undiscovered'
  | 'no-eggs';

export interface PokemonMetadata {
  /** 0..255, lower = harder to catch. */
  catch_rate?: number;
  /** Base EXP yield. */
  base_exp?: number;
  /** 0..255, lower = harder to befriend. */
  base_friendship?: number;
  /** Probability of male, in tenths (e.g. 5 = 50% male, -1 = genderless). */
  gender_rate?: number;
  /** Number of steps to hatch an egg in mainline games (not PLA). */
  hatch_steps?: number;
  egg_groups?: EggGroup[];
}

export interface LearnsetEntry {
  move_id: string;
  method: 'level' | 'tutor' | 'evolution';
  level?: number;
}

export interface Pokemon {
  id: string;
  dex_no: number;
  name_ar: string;
  name_en: string;
  types: PokemonType[];
  tags: PokemonTag[];
  stats: Stats;
  description_ar: string;
  description_en: string;
  evolutions: Evolution[];
  images: {
    thumb: string;
    artwork: string;
    animated?: string;
  };
  learnset: LearnsetEntry[];
  spawn_refs: string[];
  /** Optional extra metadata used by the Breeding / Encounter sections. */
  meta?: PokemonMetadata;
}

export interface Spawn {
  id: string;
  pokemon_id: string;
  location_id: string;
  area_ar: string;
  area_en: string;
  conditions_ar: string;
  conditions_en: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare';
  is_alpha: boolean;
}

export interface SubArea {
  name_ar: string;
  name_en: string;
}

export interface Location {
  id: string;
  name_ar: string;
  name_en: string;
  region: string;
  description_ar: string;
  description_en: string;
  subareas: SubArea[];
}

export interface Move {
  id: string;
  name_ar: string;
  name_en: string;
  type: PokemonType;
  category: MoveCategory;
  power?: number;
  accuracy?: number;
  pp?: number;
  /** Move priority (default 0). Quick Attack etc. use +1. */
  priority?: number;
  description_ar: string;
  description_en: string;
}

export interface Item {
  id: string;
  name_ar: string;
  name_en: string;
  type: 'pokeball' | 'medicine' | 'berry' | 'evolution' | 'crafting' | 'key' | 'other';
  description_ar: string;
  description_en: string;
}

export interface RecipeIngredient {
  item_id: string;
  qty: number;
}

export interface Recipe {
  id: string;
  name_ar: string;
  name_en: string;
  outputs: RecipeIngredient[];
  ingredients: RecipeIngredient[];
  unlock_notes_ar: string;
  unlock_notes_en: string;
}

export interface Request {
  id: string;
  title_ar: string;
  title_en: string;
  giver: string;
  location_id: string;
  requirements_ar: string;
  requirements_en: string;
  steps_ar: string;
  steps_en: string;
  rewards_ar: string;
  rewards_en: string;
}

export interface DataPack {
  version: string;
  locale_default: 'ar' | 'en';
  pokemon: Pokemon[];
  moves: Move[];
  items: Item[];
  recipes: Recipe[];
  locations: Location[];
  spawns: Spawn[];
  requests: Request[];
}

export interface AppSettings {
  language: 'ar' | 'en';
  theme: 'dark';
  reduceMotion: boolean;
  pinEnabled: boolean;
  pin?: string;
}

export interface FavoriteItem {
  type: 'pokemon' | 'move' | 'item' | 'location';
  id: string;
  addedAt: number;
}

export interface RecentItem {
  type: 'pokemon' | 'move' | 'item' | 'location' | 'request';
  id: string;
  viewedAt: number;
}

// Living Dex tracking
export interface LivingDexEntry {
  pokemon_id: string;
  caught: boolean;
  alpha: boolean;
  shiny: boolean;
  notes: string;
  updated_at: number;
}
