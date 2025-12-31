import { Pokemon } from '@/types/pokemon';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { toggleFavorite, isFavorite } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Link } from 'react-router-dom';

const typeColors: Record<string, string> = {
  normal: 'from-type-normal/30 to-type-normal/10',
  fire: 'from-type-fire/30 to-type-fire/10',
  water: 'from-type-water/30 to-type-water/10',
  electric: 'from-type-electric/30 to-type-electric/10',
  grass: 'from-type-grass/30 to-type-grass/10',
  ice: 'from-type-ice/30 to-type-ice/10',
  fighting: 'from-type-fighting/30 to-type-fighting/10',
  poison: 'from-type-poison/30 to-type-poison/10',
  ground: 'from-type-ground/30 to-type-ground/10',
  flying: 'from-type-flying/30 to-type-flying/10',
  psychic: 'from-type-psychic/30 to-type-psychic/10',
  bug: 'from-type-bug/30 to-type-bug/10',
  rock: 'from-type-rock/30 to-type-rock/10',
  ghost: 'from-type-ghost/30 to-type-ghost/10',
  dragon: 'from-type-dragon/30 to-type-dragon/10',
  dark: 'from-type-dark/30 to-type-dark/10',
  steel: 'from-type-steel/30 to-type-steel/10',
  fairy: 'from-type-fairy/30 to-type-fairy/10',
};

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const { t } = useLanguage();
  const [animateFav, setAnimateFav] = useState(false);
  
  const favorite = useLiveQuery(() => isFavorite('pokemon', pokemon.id), [pokemon.id]);
  
  const isLegendary = pokemon.tags.includes('legendary') || pokemon.tags.includes('mythical');
  const isAlpha = pokemon.tags.includes('alpha');
  const isNoble = pokemon.tags.includes('noble');
  
  const getBadgeClass = () => {
    if (isLegendary) return 'wax-seal glow-gold';
    if (isAlpha) return 'token-stack glow-alpha';
    if (isNoble) return 'glow-magenta';
    return 'bouquet-badge';
  };
  
  const gradient = typeColors[pokemon.types[0]] || typeColors.normal;
  
  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimateFav(true);
    await toggleFavorite('pokemon', pokemon.id);
    setTimeout(() => setAnimateFav(false), 400);
  };

  return (
    <Link to={`/pokemon/${pokemon.id}`}>
      <div className={cn(
        'group relative rounded-xl border border-border/50 bg-gradient-to-br p-4 card-hover sparkle cursor-pointer',
        gradient,
        isLegendary && 'border-gold/50',
        isAlpha && 'border-destructive/50',
      )}>
        {/* Favorite button */}
        <button 
          onClick={handleFavorite}
          className="absolute top-2 end-2 z-10 p-1.5 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
        >
          <Star 
            className={cn(
              'w-4 h-4 transition-all',
              favorite ? 'fill-gold text-gold' : 'text-muted-foreground',
              animateFav && 'favorite-pulse'
            )} 
          />
        </button>
        
        {/* Tags */}
        <div className="absolute top-2 start-2 flex gap-1">
          {isLegendary && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gold/20 text-gold border border-gold/30">
              {t('أسطوري', 'LEGEND')}
            </span>
          )}
          {isAlpha && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-destructive/20 text-destructive border border-destructive/30">
              {t('ألفا', 'ALPHA')}
            </span>
          )}
          {isNoble && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-accent/20 text-accent border border-accent/30">
              {t('نبيل', 'NOBLE')}
            </span>
          )}
        </div>
        
        {/* Image */}
        <div className={cn('relative w-20 h-20 mx-auto mt-4 mb-2', getBadgeClass())}>
          <img 
            src={pokemon.images.artwork} 
            alt={t(pokemon.name_ar, pokemon.name_en)}
            className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        
        {/* Dex number */}
        <div className="text-center text-xs text-muted-foreground mb-1">
          #{String(pokemon.dex_no).padStart(3, '0')}
        </div>
        
        {/* Name */}
        <h3 className="text-center font-semibold text-foreground mb-2 truncate">
          {t(pokemon.name_ar, pokemon.name_en)}
        </h3>
        
        {/* Types */}
        <div className="flex justify-center gap-1">
          {pokemon.types.map(type => (
            <span 
              key={type}
              className={cn(
                'px-2 py-0.5 text-[10px] font-medium rounded-full capitalize',
                `bg-type-${type}/20 text-type-${type} border border-type-${type}/30`
              )}
              style={{ 
                backgroundColor: `hsl(var(--type-${type}) / 0.2)`,
                color: `hsl(var(--type-${type}))`,
                borderColor: `hsl(var(--type-${type}) / 0.3)`
              }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
