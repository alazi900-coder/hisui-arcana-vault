import Dexie, { Table } from 'dexie';
import type { 
  Pokemon, Move, Item, Recipe, Location, Spawn, Request,
  AppSettings, FavoriteItem, RecentItem, LivingDexEntry 
} from '@/types/pokemon';

export class PLADexDatabase extends Dexie {
  pokemon!: Table<Pokemon, string>;
  moves!: Table<Move, string>;
  items!: Table<Item, string>;
  recipes!: Table<Recipe, string>;
  locations!: Table<Location, string>;
  spawns!: Table<Spawn, string>;
  requests!: Table<Request, string>;
  settings!: Table<AppSettings, number>;
  favorites!: Table<FavoriteItem, [string, string]>;
  recents!: Table<RecentItem, string>;
  metadata!: Table<{ key: string; value: string }, string>;
  livingDex!: Table<LivingDexEntry, string>;

  constructor() {
    super('PLADexX');
    
    this.version(1).stores({
      pokemon: 'id, dex_no, name_ar, name_en, *types, *tags',
      moves: 'id, name_ar, name_en, type, category',
      items: 'id, name_ar, name_en, type',
      recipes: 'id, name_ar, name_en',
      locations: 'id, name_ar, name_en, region',
      spawns: 'id, pokemon_id, location_id, rarity, is_alpha',
      requests: 'id, title_ar, title_en, location_id',
      settings: '++id',
      favorites: '[type+id], type, addedAt',
      recents: 'id, type, viewedAt',
      metadata: 'key',
    });
    
    // Add Living Dex table in version 2
    this.version(2).stores({
      pokemon: 'id, dex_no, name_ar, name_en, *types, *tags',
      moves: 'id, name_ar, name_en, type, category',
      items: 'id, name_ar, name_en, type',
      recipes: 'id, name_ar, name_en',
      locations: 'id, name_ar, name_en, region',
      spawns: 'id, pokemon_id, location_id, rarity, is_alpha',
      requests: 'id, title_ar, title_en, location_id',
      settings: '++id',
      favorites: '[type+id], type, addedAt',
      recents: 'id, type, viewedAt',
      metadata: 'key',
      livingDex: 'pokemon_id, caught, alpha, shiny, updated_at',
    });
  }
}

export const db = new PLADexDatabase();

// Helper functions
export async function getSettings(): Promise<AppSettings> {
  const settings = await db.settings.toCollection().first();
  return settings || {
    language: 'ar',
    theme: 'dark',
    reduceMotion: false,
    pinEnabled: false,
  };
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
  const current = await getSettings();
  const id = await db.settings.toCollection().primaryKeys();
  if (id.length > 0) {
    await db.settings.update(id[0], { ...current, ...settings });
  } else {
    await db.settings.add({ ...current, ...settings });
  }
}

export async function toggleFavorite(type: FavoriteItem['type'], id: string): Promise<boolean> {
  const existing = await db.favorites.get([type, id]);
  if (existing) {
    await db.favorites.delete([type, id]);
    return false;
  } else {
    await db.favorites.add({ type, id, addedAt: Date.now() });
    return true;
  }
}

export async function isFavorite(type: FavoriteItem['type'], id: string): Promise<boolean> {
  const existing = await db.favorites.get([type, id]);
  return !!existing;
}

export async function addRecent(type: RecentItem['type'], id: string): Promise<void> {
  const recentId = `${type}-${id}`;
  await db.recents.put({ id: recentId, type, viewedAt: Date.now() });
  
  // Keep only last 20 items
  const count = await db.recents.count();
  if (count > 20) {
    const oldest = await db.recents.orderBy('viewedAt').limit(count - 20).toArray();
    await db.recents.bulkDelete(oldest.map(r => r.id));
  }
}

export async function getRecents(limit = 6): Promise<RecentItem[]> {
  return db.recents.orderBy('viewedAt').reverse().limit(limit).toArray();
}

export async function getDataVersion(): Promise<string | null> {
  const meta = await db.metadata.get('dataVersion');
  return meta?.value || null;
}

export async function setDataVersion(version: string): Promise<void> {
  await db.metadata.put({ key: 'dataVersion', value: version });
}

export async function clearAllData(): Promise<void> {
  await Promise.all([
    db.pokemon.clear(),
    db.moves.clear(),
    db.items.clear(),
    db.recipes.clear(),
    db.locations.clear(),
    db.spawns.clear(),
    db.requests.clear(),
    db.metadata.clear(),
  ]);
}

export async function hasData(): Promise<boolean> {
  const count = await db.pokemon.count();
  return count > 0;
}
