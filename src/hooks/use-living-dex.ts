import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { LivingDexEntry } from '@/types/pokemon';

// Get a single Living Dex entry
export function useLivingDexEntry(pokemonId: string) {
  return useLiveQuery(
    () => db.livingDex.get(pokemonId),
    [pokemonId]
  );
}

// Get all Living Dex entries
export function useLivingDexAll() {
  return useLiveQuery(() => db.livingDex.toArray());
}

// Get Living Dex stats
export function useLivingDexStats() {
  return useLiveQuery(async () => {
    const entries = await db.livingDex.toArray();
    const totalPokemon = await db.pokemon.count();
    
    const caught = entries.filter(e => e.caught).length;
    const alpha = entries.filter(e => e.alpha).length;
    const shiny = entries.filter(e => e.shiny).length;
    
    return {
      totalPokemon,
      caught,
      alpha,
      shiny,
      percentage: totalPokemon > 0 ? (caught / totalPokemon) * 100 : 0,
    };
  });
}

// Get recent activity (last updated entries)
export function useLivingDexRecent(limit = 10) {
  return useLiveQuery(async () => {
    const entries = await db.livingDex
      .orderBy('updated_at')
      .reverse()
      .limit(limit)
      .toArray();
    
    // Get Pokemon details for each entry
    const withDetails = await Promise.all(
      entries.map(async (entry) => {
        const pokemon = await db.pokemon.get(entry.pokemon_id);
        return { ...entry, pokemon };
      })
    );
    
    return withDetails.filter(e => e.pokemon);
  }, [limit]);
}

// Update Living Dex entry
export async function updateLivingDexEntry(
  pokemonId: string,
  updates: Partial<Omit<LivingDexEntry, 'pokemon_id' | 'updated_at'>>
) {
  const existing = await db.livingDex.get(pokemonId);
  
  if (existing) {
    await db.livingDex.update(pokemonId, {
      ...updates,
      updated_at: Date.now(),
    });
  } else {
    await db.livingDex.add({
      pokemon_id: pokemonId,
      caught: updates.caught ?? false,
      alpha: updates.alpha ?? false,
      shiny: updates.shiny ?? false,
      notes: updates.notes ?? '',
      updated_at: Date.now(),
    });
  }
}

// Toggle a specific field
export async function toggleLivingDexField(
  pokemonId: string,
  field: 'caught' | 'alpha' | 'shiny'
) {
  const existing = await db.livingDex.get(pokemonId);
  const currentValue = existing?.[field] ?? false;
  
  await updateLivingDexEntry(pokemonId, {
    [field]: !currentValue,
  });
  
  return !currentValue;
}

// Update notes
export async function updateLivingDexNotes(pokemonId: string, notes: string) {
  await updateLivingDexEntry(pokemonId, { notes });
}

// Export Living Dex data as JSON
export async function exportLivingDexData() {
  const entries = await db.livingDex.toArray();
  const pokemon = await db.pokemon.toArray();
  
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    game: 'Pokemon Legends: Arceus',
    stats: {
      total: pokemon.length,
      caught: entries.filter(e => e.caught).length,
      alpha: entries.filter(e => e.alpha).length,
      shiny: entries.filter(e => e.shiny).length,
    },
    entries: entries.map(e => {
      const poke = pokemon.find(p => p.id === e.pokemon_id);
      return {
        pokemon_id: e.pokemon_id,
        dex_no: poke?.dex_no,
        name_en: poke?.name_en,
        name_ar: poke?.name_ar,
        caught: e.caught,
        alpha: e.alpha,
        shiny: e.shiny,
        notes: e.notes,
        updated_at: new Date(e.updated_at).toISOString(),
      };
    }),
  };
  
  return exportData;
}

// Clear all Living Dex data
export async function clearLivingDexData() {
  await db.livingDex.clear();
}

// Get Living Dex map for quick lookups
export function useLivingDexMap() {
  return useLiveQuery(async () => {
    const entries = await db.livingDex.toArray();
    const map = new Map<string, LivingDexEntry>();
    entries.forEach(e => map.set(e.pokemon_id, e));
    return map;
  });
}
