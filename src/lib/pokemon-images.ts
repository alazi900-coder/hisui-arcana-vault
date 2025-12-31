/**
 * Helper functions for Pokémon images with multiple fallbacks
 */

const SHOWDOWN_BASE = 'https://play.pokemonshowdown.com/sprites';
const POKEAPI_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const ASSETS_BASE = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full';

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
    // Convert kebab-case to showdown format
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
 * Get animated sprite fallback (PokeAPI)
 */
export function getAnimatedSpriteFallback(dexNo: number): string {
  return `${POKEAPI_BASE}/versions/generation-v/black-white/animated/${dexNo}.gif`;
}

/**
 * Get artwork URL (PokeAPI official artwork)
 */
export function getArtworkUrl(dexNo: number): string {
  return `${POKEAPI_BASE}/other/official-artwork/${dexNo}.png`;
}

/**
 * Get artwork fallback (Pokemon.com assets)
 */
export function getArtworkFallback(dexNo: number): string {
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
 * Create an image error handler that chains through fallbacks
 */
export function createImageFallbackHandler(
  fallbacks: string[],
  finalFallback: string = '/placeholder.svg'
): (e: React.SyntheticEvent<HTMLImageElement>) => void {
  let currentIndex = 0;
  
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    
    if (currentIndex < fallbacks.length) {
      target.src = fallbacks[currentIndex];
      currentIndex++;
    } else {
      target.src = finalFallback;
    }
  };
}

/**
 * Get all image sources for a Pokemon in priority order
 */
export function getPokemonImageSources(pokemonId: string, dexNo: number, currentImages?: { animated?: string; artwork: string }) {
  return {
    animated: getAnimatedSpriteUrl(pokemonId),
    animatedFallbacks: [
      currentImages?.animated || getAnimatedSpriteFallback(dexNo),
      getArtworkUrl(dexNo),
      getArtworkFallback(dexNo),
    ],
    artwork: currentImages?.artwork || getArtworkUrl(dexNo),
    artworkFallbacks: [
      getArtworkFallback(dexNo),
    ],
  };
}
