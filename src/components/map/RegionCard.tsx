import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Location } from '@/types/pokemon';

interface RegionConfig {
  color: string;
  gradient: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
  shape: string;
  icon: string;
}

interface RegionStats {
  total: number;
  caught: number;
  alpha: number;
}

interface RegionCardProps {
  location: Location;
  config: RegionConfig;
  stats: RegionStats;
  isSelected: boolean;
  isRTL: boolean;
  onSelect: () => void;
}

export function RegionCard({
  location,
  config,
  stats,
  isSelected,
  isRTL,
  onSelect,
}: RegionCardProps) {
  const progress = stats.total > 0 ? Math.round((stats.caught / stats.total) * 100) : 0;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "absolute transition-all duration-300 rounded-2xl group",
        "hover:scale-110 hover:z-20",
        isSelected && "scale-110 z-20"
      )}
      style={{
        top: config.position.top,
        left: config.position.left,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Region card */}
      <div className={cn(
        "relative px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300",
        "bg-gradient-to-br",
        config.gradient,
        isSelected 
          ? "border-primary shadow-lg shadow-primary/20 glow-cyan" 
          : "border-border/50 hover:border-primary/50"
      )}>
        {/* Progress ring */}
        <div className="absolute -top-1 -right-1 w-6 h-6">
          <svg className="w-6 h-6 -rotate-90">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-background/30"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${progress * 0.628} 62.8`}
              className="text-primary"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
            {progress}%
          </span>
        </div>

        {/* Icon */}
        <div className="text-2xl mb-1">{config.icon}</div>
        
        {/* Region name */}
        <div className="text-sm font-bold text-foreground whitespace-nowrap">
          {isRTL ? location.name_ar : location.name_en}
        </div>
        
        {/* Stats badges */}
        <div className="flex items-center justify-center gap-1 mt-1">
          <Badge variant="outline" className="text-xs bg-background/50 gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            {stats.caught}
          </Badge>
          <Badge variant="outline" className="text-xs bg-background/50 gap-1">
            <Circle className="w-3 h-3 text-muted-foreground" />
            {stats.total}
          </Badge>
        </div>

        {/* Pulse ring when selected */}
        {isSelected && (
          <div className="absolute -inset-2 rounded-2xl border-2 border-primary/50 animate-pulse" />
        )}
      </div>
    </button>
  );
}
