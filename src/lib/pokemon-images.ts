/**
 * Helper functions for Pokémon images with multiple fallbacks
 */

const SHOWDOWN_BASE = 'https://play.pokemonshowdown.com/sprites';
const POKEAPI_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const ASSETS_BASE = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full';

// Mapping for Hisuian form IDs to their national dex numbers
const HISUIAN_FORMS: Record<string, number> = {
  'hisuian-decidueye': 724,
  'hisuian-typhlosion': 157,
  'hisuian-samurott': 503,
  'hisuian-growlithe': 58,
  'hisuian-arcanine': 59,
  'hisuian-voltorb': 100,
  'hisuian-electrode': 101,
  'hisuian-qwilfish': 211,
  'hisuian-sneasel': 215,
  'hisuian-lilligant': 549,
  'hisuian-zorua': 570,
  'hisuian-zoroark': 571,
  'hisuian-braviary': 628,
  'hisuian-sliggoo': 705,
  'hisuian-goodra': 706,
  'hisuian-avalugg': 713,
};

/**
 * Convert Pokemon ID to Showdown sprite name
 * Handles Hisuian forms and special cases
 */
function toShowdownName(pokemonId: string): string {
  // Handle Hisuian forms
  if (pokemonId.startsWith('hisuian-')) {
    const baseName = pokemonId.replace('hisuian-', '');
    return `${baseName}-hisui`;
  }
  
  // Handle origin forms (Dialga/Palkia)
  if (pokemonId.endsWith('-origin')) {
    const baseName = pokemonId.replace('-origin', '');
    return `${baseName}-origin`;
  }
  
  // Handle other special forms
  if (pokemonId.includes('-')) {
    return pokemonId;
  }
  
  return pokemonId;
}

/**
 * Get animated sprite URL with Showdown as primary source
 */
export function getAnimatedSpriteUrl(pokemonId: string): string {
  const showdownName = toShowdownName(pokemonId);
  return `${SHOWDOWN_BASE}/ani/${showdownName}.gif`;
}

/**
 * Get static Showdown sprite (more reliable than animated)
 */
export function getShowdownStaticSprite(pokemonId: string): string {
  const showdownName = toShowdownName(pokemonId);
  return `${SHOWDOWN_BASE}/gen5/${showdownName}.png`;
}

/**
 * Get PokeAPI artwork using dex number
 */
export function getPokeApiArtwork(dexNo: number): string {
  return `${POKEAPI_BASE}/other/official-artwork/${dexNo}.png`;
}

/**
 * Get Pokemon.com assets (very reliable)
 */
export function getPokemonComAsset(dexNo: number): string {
  const paddedNo = String(dexNo).padStart(3, '0');
  return `${ASSETS_BASE}/${paddedNo}.png`;
}

/**
 * Get thumbnail URL
 */
export function getThumbUrl(dexNo: number): string {
  return `${POKEAPI_BASE}/${dexNo}.png`;
}

/**
 * Get reliable image sources for a Pokemon with proper fallbacks
 * Priority: PokeAPI artwork > Showdown static > Pokemon.com
 */
export function getReliableImageSources(pokemonId: string, dexNo: number): string[] {
  const isHisuian = pokemonId.startsWith('hisuian-');
  const baseDexNo = isHisuian ? HISUIAN_FORMS[pokemonId] || dexNo : dexNo;
  
  const sources: string[] = [];
  
  // Primary: PokeAPI official artwork (most reliable)
  sources.push(getPokeApiArtwork(baseDexNo));
  
  // Fallback 1: Showdown static sprite
  sources.push(getShowdownStaticSprite(pokemonId));
  
  // Fallback 2: Pokemon.com assets
  sources.push(getPokemonComAsset(baseDexNo));
  
  // Fallback 3: Showdown animated
  sources.push(getAnimatedSpriteUrl(pokemonId));
  
  return sources;
}

/**
 * Get all image sources for a Pokemon in priority order (legacy support)
 */
export function getPokemonImageSources(pokemonId: string, dexNo: number, currentImages?: { animated?: string; artwork: string }) {
  return {
    animated: getAnimatedSpriteUrl(pokemonId),
    animatedFallbacks: [
      currentImages?.animated || `${POKEAPI_BASE}/versions/generation-v/black-white/animated/${dexNo}.gif`,
      getPokeApiArtwork(dexNo),
      getPokemonComAsset(dexNo),
    ],
    artwork: currentImages?.artwork || getPokeApiArtwork(dexNo),
    artworkFallbacks: [
      getPokemonComAsset(dexNo),
    ],
  };
}
