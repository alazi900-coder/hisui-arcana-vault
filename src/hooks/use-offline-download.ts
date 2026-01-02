import { useState, useCallback } from 'react';
import { db } from '@/lib/db';
import { getReliableImageSources } from '@/lib/pokemon-images';

export interface OfflineDownloadProgress {
  stage: 'idle' | 'data' | 'images' | 'complete' | 'error';
  dataProgress: number;
  imagesProgress: number;
  imagesTotal: number;
  imagesCurrent: number;
  currentItem: string;
  error?: string;
}

const IMAGE_CACHE_NAME = 'img-cache-v1';

// Get all image URLs that need to be cached
async function collectAllImageUrls(): Promise<string[]> {
  const urls: Set<string> = new Set();
  
  // Pokemon images
  const pokemon = await db.pokemon.toArray();
  for (const p of pokemon) {
    // Get reliable sources for each pokemon
    const sources = getReliableImageSources(p.id, p.dex_no);
    sources.forEach(src => urls.add(src));
    
    // Also add any stored image URLs
    if (p.images?.artwork) urls.add(p.images.artwork);
    if (p.images?.thumb) urls.add(p.images.thumb);
    if (p.images?.animated) urls.add(p.images.animated);
  }
  
  // Item images (from PokeAPI)
  const items = await db.items.toArray();
  for (const item of items) {
    // Standard item sprite URL
    const itemId = item.id.replace(/-/g, '-');
    urls.add(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemId}.png`);
  }
  
  // Move type icons would be generated from type badges, no external images needed
  
  return Array.from(urls);
}

// Cache a single image with retry
async function cacheImageWithRetry(url: string, cache: Cache, retries = 2): Promise<boolean> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, { 
        mode: 'cors',
        cache: 'no-cache' // Force fresh fetch to cache
      });
      if (response.ok) {
        await cache.put(url, response.clone());
        return true;
      }
    } catch {
      if (i === retries) return false;
      await new Promise(r => setTimeout(r, 100 * (i + 1))); // Backoff
    }
  }
  return false;
}

export function useOfflineDownload() {
  const [progress, setProgress] = useState<OfflineDownloadProgress>({
    stage: 'idle',
    dataProgress: 0,
    imagesProgress: 0,
    imagesTotal: 0,
    imagesCurrent: 0,
    currentItem: '',
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const startDownload = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // Stage 1: Data (already in IndexedDB from seed)
      setProgress({
        stage: 'data',
        dataProgress: 0,
        imagesProgress: 0,
        imagesTotal: 0,
        imagesCurrent: 0,
        currentItem: '',
      });

      // Check if data exists, if not load it
      const pokemonCount = await db.pokemon.count();
      if (pokemonCount === 0) {
        const { loadSeedData } = await import('@/lib/seed-data');
        await loadSeedData();
      }
      
      setProgress(p => ({ ...p, dataProgress: 100 }));
      
      // Stage 2: Images
      setProgress(p => ({ ...p, stage: 'images' }));
      
      const imageUrls = await collectAllImageUrls();
      const total = imageUrls.length;
      
      setProgress(p => ({ ...p, imagesTotal: total }));
      
      // Open the cache
      const cache = await caches.open(IMAGE_CACHE_NAME);
      
      // Download images in batches for better performance
      const batchSize = 10;
      let downloaded = 0;
      
      for (let i = 0; i < imageUrls.length; i += batchSize) {
        const batch = imageUrls.slice(i, i + batchSize);
        
        // Check which images are already cached
        const toDownload: string[] = [];
        for (const url of batch) {
          const cached = await cache.match(url);
          if (!cached) {
            toDownload.push(url);
          } else {
            downloaded++;
          }
        }
        
        // Download uncached images in parallel
        if (toDownload.length > 0) {
          const results = await Promise.allSettled(
            toDownload.map(url => cacheImageWithRetry(url, cache))
          );
          downloaded += results.filter(r => r.status === 'fulfilled' && r.value).length;
        }
        
        const currentUrl = batch[batch.length - 1] || '';
        const pokemonName = currentUrl.split('/').pop()?.split('.')[0] || '';
        
        setProgress(p => ({
          ...p,
          imagesCurrent: Math.min(i + batchSize, total),
          imagesProgress: Math.round(((i + batchSize) / total) * 100),
          currentItem: pokemonName,
        }));
        
        // Small delay to prevent overwhelming
        await new Promise(r => setTimeout(r, 50));
      }
      
      // Save last download time
      localStorage.setItem('offline-last-download', new Date().toISOString());
      
      setProgress({
        stage: 'complete',
        dataProgress: 100,
        imagesProgress: 100,
        imagesTotal: total,
        imagesCurrent: downloaded,
        currentItem: '',
      });
      
    } catch (error) {
      console.error('Offline download error:', error);
      setProgress(p => ({
        ...p,
        stage: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading]);

  const resetProgress = useCallback(() => {
    setProgress({
      stage: 'idle',
      dataProgress: 0,
      imagesProgress: 0,
      imagesTotal: 0,
      imagesCurrent: 0,
      currentItem: '',
    });
  }, []);

  return {
    progress,
    isDownloading,
    startDownload,
    resetProgress,
  };
}

// Utility functions for cache management
export async function getImageCacheStats(): Promise<{ count: number; sizeBytes: number }> {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const keys = await cache.keys();
    
    let totalSize = 0;
    // Estimate size from cache keys (rough estimate)
    for (const request of keys.slice(0, 50)) { // Sample first 50
      const response = await cache.match(request);
      if (response) {
        const blob = await response.clone().blob();
        totalSize += blob.size;
      }
    }
    
    // Extrapolate for all entries
    const avgSize = keys.length > 0 ? totalSize / Math.min(keys.length, 50) : 0;
    const estimatedTotalSize = Math.round(avgSize * keys.length);
    
    return { count: keys.length, sizeBytes: estimatedTotalSize };
  } catch {
    return { count: 0, sizeBytes: 0 };
  }
}

export async function clearImageCache(): Promise<void> {
  try {
    await caches.delete(IMAGE_CACHE_NAME);
    localStorage.removeItem('offline-last-download');
  } catch (error) {
    console.error('Failed to clear image cache:', error);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getLastDownloadTime(): string | null {
  return localStorage.getItem('offline-last-download');
}
