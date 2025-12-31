import { useLanguage } from '@/contexts/LanguageContext';
import { HisuiMap } from '@/components/HisuiMap';
import { Map as MapIcon, Compass } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function MapPage() {
  const { t, isRTL } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('خريطة هيسوي التفاعلية | PLA Dex X', 'Hisui Interactive Map | PLA Dex X')}</title>
        <meta 
          name="description" 
          content={t(
            'استكشف خريطة هيسوي التفاعلية واكتشف أماكن ظهور جميع البوكيمونات في Pokémon Legends: Arceus',
            'Explore the interactive Hisui map and discover all Pokémon spawn locations in Pokémon Legends: Arceus'
          )} 
        />
      </Helmet>

      <div className="pb-20 pt-20">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/20 relative">
              <MapIcon className="w-6 h-6 text-primary" />
              <Compass className="w-3 h-3 text-accent absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {t('خريطة هيسوي', 'Hisui Map')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('اضغط على أي منطقة لعرض البوكيمونات', 'Tap any region to see Pokémon')}
              </p>
            </div>
          </div>

          {/* Map */}
          <HisuiMap />

          {/* Tips */}
          <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border/50">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              {t('نصائح', 'Tips')}
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• {t('اضغط على منطقة لعرض البوكيمونات الموجودة فيها', 'Tap a region to see its Pokémon')}</li>
              <li>• {t('استخدم الفلاتر للبحث عن بوكيمونات نادرة أو ألفا', 'Use filters to find rare or Alpha Pokémon')}</li>
              <li>• {t('بعض البوكيمونات تظهر فقط في أوقات معينة', 'Some Pokémon only appear at certain times')}</li>
              <li>• {t('بوكيمونات ألفا أقوى وأكبر حجماً', 'Alpha Pokémon are stronger and larger')}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
