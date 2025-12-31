import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { LocationCard } from '@/components/LocationCard';
import { MapPin, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function LocationsPage() {
  const { t, isRTL } = useLanguage();
  const locations = useLiveQuery(() => db.locations.toArray(), []);

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {t('مواقع هيسوي', 'Hisui Locations')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('اكتشف مناطق هيسوي الخمس', 'Explore the five regions of Hisui')}
              </p>
            </div>
          </div>

          {/* Map button */}
          <Link
            to="/map"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl",
              "bg-primary/10 hover:bg-primary/20 text-primary transition-colors",
              "border border-primary/30"
            )}
          >
            <Map className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t('الخريطة', 'Map')}
            </span>
          </Link>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {locations?.map((location, i) => (
            <div 
              key={location.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <LocationCard location={location} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {locations?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('لا توجد مواقع', 'No locations found')}
          </div>
        )}
      </div>
    </div>
  );
}