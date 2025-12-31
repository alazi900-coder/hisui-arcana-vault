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

export interface Evolution {
  to_id: string;
  conditions_ar: string;
  conditions_en: string;
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
