import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { ChevronLeft, User, MapPin, Target, ListChecks, Gift } from 'lucide-react';

export default function RequestDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const request = useLiveQuery(() => db.requests.get(id || ''), [id]);
  const location = useLiveQuery(
    () => request ? db.locations.get(request.location_id) : undefined,
    [request?.location_id]
  );

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-16">
      {/* Header */}
      <div className="relative h-32 flex items-end bg-gradient-to-br from-accent/20 to-primary/10 p-4">
        {/* Back button */}
        <Link 
          to="/requests" 
          className="absolute top-4 start-4 p-2 rounded-full glass hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </Link>

        <h1 className="text-xl font-bold text-foreground">
          {t(request.title_ar, request.title_en)}
        </h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Giver */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <User className="w-4 h-4" />
              <span className="text-xs">{t('المُعطي', 'Giver')}</span>
            </div>
            <div className="font-semibold text-foreground">{request.giver}</div>
          </div>

          {/* Location */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs">{t('الموقع', 'Location')}</span>
            </div>
            <div className="font-semibold text-foreground text-sm">
              {location ? t(location.name_ar, location.name_en) : request.location_id}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 text-accent mb-3">
            <Target className="w-5 h-5" />
            <h2 className="font-semibold">{t('المتطلبات', 'Requirements')}</h2>
          </div>
          <p className="text-foreground leading-relaxed">
            {t(request.requirements_ar, request.requirements_en)}
          </p>
        </div>

        {/* Steps */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 text-primary mb-3">
            <ListChecks className="w-5 h-5" />
            <h2 className="font-semibold">{t('الخطوات', 'Steps')}</h2>
          </div>
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {t(request.steps_ar, request.steps_en)}
          </p>
        </div>

        {/* Rewards */}
        <div className="glass rounded-xl p-4 border border-gold/30">
          <div className="flex items-center gap-2 text-gold mb-3">
            <Gift className="w-5 h-5" />
            <h2 className="font-semibold">{t('المكافآت', 'Rewards')}</h2>
          </div>
          <p className="text-foreground leading-relaxed">
            {t(request.rewards_ar, request.rewards_en)}
          </p>
        </div>
      </div>
    </div>
  );
}