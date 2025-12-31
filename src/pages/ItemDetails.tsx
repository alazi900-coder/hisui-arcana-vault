import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addRecent } from '@/lib/db';
import { ChevronLeft, Circle, Heart, Cherry, Sparkles, Hammer, Key, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, React.ReactNode> = {
  pokeball: <Circle className="w-8 h-8" />,
  medicine: <Heart className="w-8 h-8" />,
  berry: <Cherry className="w-8 h-8" />,
  evolution: <Sparkles className="w-8 h-8" />,
  crafting: <Hammer className="w-8 h-8" />,
  key: <Key className="w-8 h-8" />,
  other: <Package className="w-8 h-8" />,
};

const typeColors: Record<string, string> = {
  pokeball: 'bg-destructive/20 text-destructive',
  medicine: 'bg-type-grass/20 text-type-grass',
  berry: 'bg-accent/20 text-accent',
  evolution: 'bg-type-psychic/20 text-type-psychic',
  crafting: 'bg-type-rock/20 text-type-rock',
  key: 'bg-gold/20 text-gold',
  other: 'bg-muted text-muted-foreground',
};

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const item = useLiveQuery(() => db.items.get(id || ''), [id]);

  // Track recent view
  useEffect(() => {
    if (id) {
      addRecent('item', id);
    }
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  const icon = typeIcons[item.type] || typeIcons.other;
  const colorClass = typeColors[item.type] || typeColors.other;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pokeball': return t('كرة بوكيمون', 'Pokéball');
      case 'medicine': return t('دواء', 'Medicine');
      case 'berry': return t('توت', 'Berry');
      case 'evolution': return t('حجر تطور', 'Evolution Item');
      case 'crafting': return t('مادة تصنيع', 'Crafting Material');
      case 'key': return t('عنصر مفتاح', 'Key Item');
      default: return t('عنصر آخر', 'Other');
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-16">
      {/* Header */}
      <div className={cn(
        'relative h-48 flex items-center justify-center',
        colorClass.replace('text-', 'bg-').replace('/20', '/10')
      )}>
        {/* Back button */}
        <Link 
          to="/items" 
          className="absolute top-4 start-4 p-2 rounded-full glass hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </Link>

        {/* Icon */}
        <div className={cn(
          'p-6 rounded-full animate-float',
          colorClass
        )}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-8">
        <div className="glass rounded-2xl p-6">
          {/* Type badge */}
          <div className="flex justify-center mb-4">
            <span className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-full',
              colorClass
            )}>
              {getTypeLabel(item.type)}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-center mb-6">
            {t(item.name_ar, item.name_en)}
          </h1>

          {/* Description */}
          <div className="glass rounded-xl p-4">
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              {t('الوصف', 'Description')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t(item.description_ar, item.description_en)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}