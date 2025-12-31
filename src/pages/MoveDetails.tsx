import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addRecent } from '@/lib/db';
import { ChevronLeft, ChevronRight, Sword, Sparkles, CircleDot, Zap, Target, Battery } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MoveDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const move = useLiveQuery(() => db.moves.get(id || ''), [id]);

  // Track recent view
  useEffect(() => {
    if (id) {
      addRecent('move', id);
    }
  }, [id]);
  const allMoves = useLiveQuery(() => db.moves.toArray(), []);

  if (!move) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  const currentIndex = allMoves?.findIndex(m => m.id === id) ?? 0;
  const prevMove = allMoves?.[currentIndex - 1];
  const nextMove = allMoves?.[currentIndex + 1];

  const CategoryIcon = () => {
    switch (move.category) {
      case 'physical':
        return <Sword className="w-6 h-6" />;
      case 'special':
        return <Sparkles className="w-6 h-6" />;
      case 'status':
        return <CircleDot className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-16">
      {/* Header */}
      <div 
        className="relative h-48 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, hsl(var(--type-${move.type}) / 0.3) 0%, hsl(var(--type-${move.type}) / 0.1) 100%)`
        }}
      >
        {/* Back button */}
        <Link 
          to="/moves" 
          className="absolute top-4 start-4 p-2 rounded-full glass hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </Link>

        {/* Navigation arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
          {prevMove ? (
            <Link 
              to={`/moves/${prevMove.id}`}
              className="p-2 rounded-full glass hover:bg-secondary/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </Link>
          ) : <div />}
          {nextMove ? (
            <Link 
              to={`/moves/${nextMove.id}`}
              className="p-2 rounded-full glass hover:bg-secondary/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </Link>
          ) : <div />}
        </div>

        {/* Category Icon */}
        <div className={cn(
          'p-6 rounded-full animate-float',
          move.category === 'physical' && 'bg-destructive/20 text-destructive glow-alpha',
          move.category === 'special' && 'bg-primary/20 text-primary glow-cyan',
          move.category === 'status' && 'bg-muted text-muted-foreground'
        )}>
          <CategoryIcon />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-8">
        <div className="glass rounded-2xl p-6">
          {/* Type and Category */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span 
              className="px-3 py-1 text-sm font-medium rounded-full capitalize"
              style={{
                backgroundColor: `hsl(var(--type-${move.type}) / 0.2)`,
                color: `hsl(var(--type-${move.type}))`,
                borderColor: `hsl(var(--type-${move.type}) / 0.3)`,
                borderWidth: '1px'
              }}
            >
              {move.type}
            </span>
            <span className={cn(
              'px-3 py-1 text-sm font-medium rounded-full capitalize',
              move.category === 'physical' && 'bg-destructive/20 text-destructive',
              move.category === 'special' && 'bg-primary/20 text-primary',
              move.category === 'status' && 'bg-muted text-muted-foreground'
            )}>
              {t(
                move.category === 'physical' ? 'فيزيائي' : move.category === 'special' ? 'خاص' : 'حالة',
                move.category
              )}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-center mb-6">
            {t(move.name_ar, move.name_en)}
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 mx-auto mb-2 text-destructive" />
              <div className="text-2xl font-bold text-foreground">
                {move.power || '—'}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('القوة', 'Power')}
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Target className="w-5 h-5 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">
                {move.accuracy ? `${move.accuracy}%` : '—'}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('الدقة', 'Accuracy')}
              </div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Battery className="w-5 h-5 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-foreground">
                {move.pp || '—'}
              </div>
              <div className="text-xs text-muted-foreground">
                PP
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-xl p-4">
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              {t('الوصف', 'Description')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t(move.description_ar, move.description_en)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}