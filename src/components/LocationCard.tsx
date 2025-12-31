import { Location } from '@/types/pokemon';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const locationColors: Record<string, string> = {
  'obsidian-fieldlands': 'from-type-grass/30 to-type-ground/10',
  'crimson-mirelands': 'from-type-poison/30 to-type-water/10',
  'cobalt-coastlands': 'from-type-water/30 to-type-flying/10',
  'coronet-highlands': 'from-type-rock/30 to-type-steel/10',
  'alabaster-icelands': 'from-type-ice/30 to-type-ghost/10',
};

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  const { t } = useLanguage();
  const gradient = locationColors[location.id] || 'from-secondary to-background';

  return (
    <Link to={`/locations/${location.id}`}>
      <div className={cn(
        'group relative rounded-2xl border border-border/50 bg-gradient-to-br p-6 card-hover sparkle cursor-pointer overflow-hidden',
        gradient
      )}>
        {/* Icon */}
        <div className="absolute top-4 end-4 p-2 rounded-full bg-background/30 backdrop-blur-sm">
          <MapPin className="w-5 h-5 text-primary" />
        </div>

        {/* Subareas count */}
        <div className="absolute bottom-4 end-4 text-xs text-muted-foreground">
          {location.subareas.length} {t('منطقة فرعية', 'subareas')}
        </div>

        {/* Content */}
        <div className="pt-4">
          {/* Region */}
          <span className="text-xs text-primary uppercase tracking-wider">
            {t('هيسوي', 'Hisui')}
          </span>

          {/* Name */}
          <h3 className="text-xl font-bold text-foreground mt-1 mb-2">
            {t(location.name_ar, location.name_en)}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {t(location.description_ar, location.description_en)}
          </p>
        </div>
      </div>
    </Link>
  );
}