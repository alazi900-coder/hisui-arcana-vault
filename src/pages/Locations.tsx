import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { LocationCard } from '@/components/LocationCard';
import { MapPin } from 'lucide-react';

export default function LocationsPage() {
  const { t } = useLanguage();
  const locations = useLiveQuery(() => db.locations.toArray(), []);

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
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