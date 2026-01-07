import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Spawn, Location } from '@/types/pokemon';

const rarityConfig = {
  common: { 
    color: 'text-type-grass', 
    bg: 'bg-type-grass/10 border-type-grass/30',
    label: { ar: 'شائع', en: 'Common' },
    icon: '🟢'
  },
  uncommon: { 
    color: 'text-type-water', 
    bg: 'bg-type-water/10 border-type-water/30',
    label: { ar: 'غير شائع', en: 'Uncommon' },
    icon: '🔵'
  },
  rare: { 
    color: 'text-type-psychic', 
    bg: 'bg-type-psychic/10 border-type-psychic/30',
    label: { ar: 'نادر', en: 'Rare' },
    icon: '🟣'
  },
  very_rare: { 
    color: 'text-gold', 
    bg: 'bg-gold/10 border-gold/30',
    label: { ar: 'نادر جداً', en: 'Very Rare' },
    icon: '⭐'
  },
};

interface LocationsListProps {
  spawns: Spawn[];
  locations: Location[];
}

export function LocationsList({ spawns, locations }: LocationsListProps) {
  const { t } = useLanguage();
  
  if (spawns.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-muted-foreground/50" />
        </div>
        {t('لا توجد مواقع ظهور معروفة', 'No known spawn locations')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {spawns.map((spawn, idx) => {
        const location = locations.find(l => l.id === spawn.location_id);
        const rarity = rarityConfig[spawn.rarity];
        
        return (
          <div 
            key={spawn.id} 
            className={cn(
              'p-4 rounded-xl border transition-all hover:scale-[1.01] animate-fade-in-up',
              spawn.is_alpha ? 'bg-destructive/10 border-destructive/30' : 'bg-secondary/30 border-border/50'
            )}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {spawn.is_alpha && (
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-destructive/30">
                <span className="px-3 py-1 text-xs font-black rounded-full bg-destructive text-white animate-pulse">
                  {t('ألفا', 'ALPHA')}
                </span>
                <span className="text-xs text-destructive">
                  {t('بوكيمون ألفا عملاق!', 'Giant Alpha Pokémon!')}
                </span>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="font-semibold block">
                    {location ? t(location.name_ar, location.name_en) : spawn.location_id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    📍 {t(spawn.area_ar, spawn.area_en)}
                  </span>
                </div>
              </div>
              <span className={cn('px-2 py-1 text-xs font-bold rounded-full border', rarity.bg, rarity.color)}>
                {rarity.icon} {t(rarity.label.ar, rarity.label.en)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
              <span>🕐</span>
              <span>{t(spawn.conditions_ar, spawn.conditions_en)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
