import { db } from './db';
import { getReliableImageSources } from './pokemon-images';

// Cache for storing downloaded images
const IMAGE_CACHE_NAME = 'pla-dex-images-v1';

export interface ImageCacheProgress {
  total: number;
  current: number;
  currentPokemon: string;
  status: 'idle' | 'downloading' | 'complete' | 'error';
}

// Open the cache
async function openImageCache(): Promise<Cache | null> {
  try {
    return await caches.open(IMAGE_CACHE_NAME);
  } catch (error) {
    console.error('Failed to open image cache:', error);
    return null;
  }
}

// Check if an image is cached
export async function isImageCached(url: string): Promise<boolean> {
  const cache = await openImageCache();
  if (!cache) return false;
  
  const response = await cache.match(url);
  return !!response;
}

// Cache a single image
export async function cacheImage(url: string): Promise<boolean> {
  const cache = await openImageCache();
  if (!cache) return false;
  
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (response.ok) {
      await cache.put(url, response.clone());
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to cache image:', url, error);
    return false;
  }
}

// Get all Pokemon and cache their images
export async function cacheAllPokemonImages(
  onProgress: (progress: ImageCacheProgress) => void
): Promise<void> {
  const pokemon = await db.pokemon.toArray();
  const total = pokemon.length;
  let current = 0;
  
  onProgress({ total, current: 0, currentPokemon: '', status: 'downloading' });
  
  for (const p of pokemon) {
    current++;
    onProgress({ 
      total, 
      current, 
      currentPokemon: p.name_en,
      status: 'downloading' 
    });
    
    // Get reliable image sources for this pokemon
    const sources = getReliableImageSources(p.id, p.dex_no);
    
    // Try to cache at least one image
    for (const src of sources) {
      const cached = await cacheImage(src);
      if (cached) break;
    }
    
    // Small delay to prevent overwhelming the network
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  onProgress({ total, current: total, currentPokemon: '', status: 'complete' });
}

// Get cache size
export async function getImageCacheSize(): Promise<number> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

// Clear image cache
export async function clearImageCache(): Promise<void> {
  try {
    await caches.delete(IMAGE_CACHE_NAME);
  } catch (error) {
    console.error('Failed to clear image cache:', error);
  }
}

// Format bytes to human readable
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
