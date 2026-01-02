import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getReliableImageSources } from '@/lib/pokemon-images';

interface PokemonImageProps {
  pokemonId: string;
  dexNo: number;
  name: string;
  currentImages?: { artwork?: string; thumb?: string; animated?: string };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSkeleton?: boolean;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-48 h-48',
  xl: 'w-64 h-64',
};

export function PokemonImage({ 
  pokemonId, 
  dexNo, 
  name, 
  currentImages,
  size = 'lg',
  className,
  showSkeleton = true,
}: PokemonImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  // Get all fallback sources
  const imageSources = getReliableImageSources(pokemonId, dexNo);
  
  // Add current image sources at the beginning if they exist
  const allSources = [
    currentImages?.artwork,
    currentImages?.animated,
    ...imageSources,
  ].filter(Boolean) as string[];
  
  const currentSrc = allSources[currentIndex];
  
  const handleError = () => {
    if (currentIndex < allSources.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-secondary/50 rounded-full border border-border/30',
        sizeClasses[size],
        className
      )}>
        <div className="text-center">
          <span className="text-3xl opacity-50">🔮</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Skeleton loader */}
      {showSkeleton && isLoading && (
        <div className={cn(
          'absolute inset-0 rounded-full bg-secondary/50 animate-pulse',
          sizeClasses[size]
        )} />
      )}
      
      {/* Actual image */}
      <img
        src={currentSrc}
        alt={name}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'w-full h-full object-contain transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
    />
    </div>
  );
}

// Simple fallback component for use in selectors
interface PokemonImageWithFallbackProps {
  pokemonId: string;
  pokemonName: string;
  className?: string;
}

export function PokemonImageWithFallback({ 
  pokemonId, 
  pokemonName, 
  className 
}: PokemonImageWithFallbackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  // Extract dex number from ID if possible
  const dexNo = parseInt(pokemonId.replace(/\D/g, '')) || 1;
  const imageSources = getReliableImageSources(pokemonId, dexNo);
  
  const handleError = () => {
    if (currentIndex < imageSources.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };
  
  if (hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-secondary/50 rounded-full border border-border/30', className)}>
        <span className="text-lg opacity-50">🔮</span>
      </div>
    );
  }
  
  return (
    <img
      src={imageSources[currentIndex]}
      alt={pokemonName}
      onError={handleError}
      className={cn('object-contain', className)}
    />
  );
}
