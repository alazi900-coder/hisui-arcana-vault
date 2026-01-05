import { useLanguage } from '@/contexts/LanguageContext';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
  rarity?: string;
  alpha?: boolean;
  timeOfDay?: 'day' | 'night';
}

interface RarityConfig {
  color: string;
  label_ar: string;
  label_en: string;
}

interface MapFiltersProps {
  filter: FilterState;
  setFilter: (updater: (prev: FilterState) => FilterState) => void;
  rarityConfig: Record<string, RarityConfig>;
}

export function MapFilters({ filter, setFilter, rarityConfig }: MapFiltersProps) {
  const { t, isRTL } = useLanguage();

  return (
    <div className="mb-4 p-3 bg-secondary/50 rounded-xl space-y-3 animate-fade-in-up">
      {/* Rarity filter */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">
          {t('الندرة', 'Rarity')}
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(rarityConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilter(f => ({ 
                ...f, 
                rarity: f.rarity === key ? undefined : key 
              }))}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                filter.rarity === key
                  ? `${config.color} text-foreground`
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {isRTL ? config.label_ar : config.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Time filter */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">
          {t('الوقت', 'Time')}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter(f => ({ 
              ...f, 
              timeOfDay: f.timeOfDay === 'day' ? undefined : 'day' 
            }))}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all",
              filter.timeOfDay === 'day'
                ? "bg-yellow-500 text-background"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <Sun className="w-3 h-3" />
            {t('نهار', 'Day')}
          </button>
          <button
            onClick={() => setFilter(f => ({ 
              ...f, 
              timeOfDay: f.timeOfDay === 'night' ? undefined : 'night' 
            }))}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all",
              filter.timeOfDay === 'night'
                ? "bg-indigo-500 text-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <Moon className="w-3 h-3" />
            {t('ليل', 'Night')}
          </button>
        </div>
      </div>

      {/* Alpha filter */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">
          {t('ألفا فقط', 'Alpha Only')}
        </label>
        <button
          onClick={() => setFilter(f => ({ 
            ...f, 
            alpha: f.alpha === true ? undefined : true 
          }))}
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all",
            filter.alpha === true
              ? "bg-red-500 text-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <Sparkles className="w-3 h-3" />
          {t('ألفا', 'Alpha')}
        </button>
      </div>

      {/* Clear filters */}
      {(filter.rarity || filter.timeOfDay || filter.alpha) && (
        <button
          onClick={() => setFilter(() => ({}))}
          className="text-xs text-primary hover:underline"
        >
          {t('مسح الفلاتر', 'Clear Filters')}
        </button>
      )}
    </div>
  );
}
