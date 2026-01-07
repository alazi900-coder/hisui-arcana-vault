import { cn } from '@/lib/utils';

interface StatBarProps {
  label: string;
  shortLabel: string;
  value: number;
  maxValue?: number;
  color: string;
  average?: number;
  delay?: number;
}

const ratingColors = {
  legendary: 'text-gold',
  excellent: 'text-primary',
  good: 'text-type-grass',
  average: 'text-muted-foreground',
  low: 'text-destructive',
};

function getStatRating(val: number): keyof typeof ratingColors {
  if (val >= 150) return 'legendary';
  if (val >= 100) return 'excellent';
  if (val >= 80) return 'good';
  if (val >= 50) return 'average';
  return 'low';
}

export function StatBar({ 
  label, 
  shortLabel,
  value, 
  maxValue = 255, 
  color,
  average,
  delay = 0
}: StatBarProps) {
  const percentage = (value / maxValue) * 100;
  const avgPercentage = average ? (average / maxValue) * 100 : 0;
  const rating = getStatRating(value);
  
  return (
    <div 
      className="flex items-center gap-3 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="w-12 text-xs font-medium text-muted-foreground uppercase">{shortLabel}</span>
      <span className={cn('w-10 text-sm font-bold', ratingColors[rating])}>{value}</span>
      <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden relative">
        {average && (
          <div 
            className="absolute top-0 h-full w-0.5 bg-white/30 z-10"
            style={{ left: `${avgPercentage}%` }}
            title={`Avg: ${average}`}
          />
        )}
        <div 
          className={cn('h-full rounded-full transition-all duration-700 ease-out', color)}
          style={{ 
            width: `${percentage}%`,
            animation: `grow-bar 0.8s ease-out ${delay}ms both`
          }}
        />
      </div>
    </div>
  );
}

export const statLabels = {
  hp: { ar: 'صحة', en: 'HP', color: 'bg-type-fighting', short: 'HP' },
  atk: { ar: 'هجوم', en: 'Attack', color: 'bg-type-fire', short: 'ATK' },
  def: { ar: 'دفاع', en: 'Defense', color: 'bg-type-electric', short: 'DEF' },
  spa: { ar: 'هـ.خاص', en: 'Sp. Atk', color: 'bg-type-water', short: 'SpA' },
  spd: { ar: 'د.خاص', en: 'Sp. Def', color: 'bg-type-grass', short: 'SpD' },
  spe: { ar: 'سرعة', en: 'Speed', color: 'bg-type-psychic', short: 'SPE' },
};

export const typeAverages: Record<string, number> = {
  normal: 75, fire: 80, water: 78, electric: 77, grass: 75, ice: 76,
  fighting: 82, poison: 74, ground: 80, flying: 76, psychic: 78, bug: 70,
  rock: 82, ghost: 78, dragon: 88, dark: 78, steel: 85, fairy: 76,
};
