import { Move } from '@/types/pokemon';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Sword, Sparkles, CircleDot } from 'lucide-react';
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

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'physical':
      return <Sword className="w-4 h-4" />;
    case 'special':
      return <Sparkles className="w-4 h-4" />;
    case 'status':
      return <CircleDot className="w-4 h-4" />;
    default:
      return null;
  }
};

interface MoveCardProps {
  move: Move;
}

export function MoveCard({ move }: MoveCardProps) {
  const { t } = useLanguage();
  const gradient = typeColors[move.type] || typeColors.normal;

  return (
    <Link to={`/moves/${move.id}`}>
      <div className={cn(
        'group relative rounded-xl border border-border/50 bg-gradient-to-br p-4 card-hover sparkle cursor-pointer',
        gradient
      )}>
        {/* Category icon */}
        <div className="absolute top-2 end-2">
          <div className={cn(
            'p-1.5 rounded-full backdrop-blur-sm',
            move.category === 'physical' && 'bg-destructive/20 text-destructive',
            move.category === 'special' && 'bg-primary/20 text-primary',
            move.category === 'status' && 'bg-muted text-muted-foreground'
          )}>
            <CategoryIcon category={move.category} />
          </div>
        </div>

        {/* Type badge */}
        <span 
          className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full capitalize mb-3"
          style={{ 
            backgroundColor: `hsl(var(--type-${move.type}) / 0.2)`,
            color: `hsl(var(--type-${move.type}))`,
            borderColor: `hsl(var(--type-${move.type}) / 0.3)`,
            borderWidth: '1px'
          }}
        >
          {move.type}
        </span>

        {/* Name */}
        <h3 className="font-semibold text-foreground mb-2 truncate">
          {t(move.name_ar, move.name_en)}
        </h3>

        {/* Stats */}
        <div className="flex gap-3 text-xs text-muted-foreground">
          {move.power && (
            <span className="flex items-center gap-1">
              <span className="text-destructive">⚔</span>
              {move.power}
            </span>
          )}
          {move.accuracy && (
            <span className="flex items-center gap-1">
              <span className="text-primary">◎</span>
              {move.accuracy}%
            </span>
          )}
          {move.pp && (
            <span className="flex items-center gap-1">
              <span className="text-accent">PP</span>
              {move.pp}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}