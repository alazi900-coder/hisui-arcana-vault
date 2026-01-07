import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Search, Swords, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Move, LearnsetEntry } from '@/types/pokemon';

const methodLabels = {
  level: { ar: 'مستوى', en: 'Level' },
  tutor: { ar: 'معلم', en: 'Tutor' },
  evolution: { ar: 'تطور', en: 'Evolution' },
};

const categoryIcons = {
  physical: '⚔️',
  special: '✨',
  status: '🔮',
};

interface MovesListProps {
  learnset: LearnsetEntry[];
  moves: Move[];
}

export function MovesList({ learnset, moves }: MovesListProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');

  const filteredAndSortedMoves = useMemo(() => {
    let filtered = [...learnset];
    
    // Filter by method
    if (filterMethod !== 'all') {
      filtered = filtered.filter(entry => entry.method === filterMethod);
    }
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(entry => {
        const move = moves.find(m => m.id === entry.move_id);
        if (!move) return false;
        return move.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
               move.name_ar.includes(searchQuery) ||
               move.type.includes(searchQuery.toLowerCase());
      });
    }
    
    // Sort
    return filtered.sort((a, b) => {
      if (a.method === 'level' && b.method === 'level') {
        return (a.level || 0) - (b.level || 0);
      }
      if (a.method === 'level') return -1;
      if (b.method === 'level') return 1;
      if (a.method === 'tutor') return -1;
      if (b.method === 'tutor') return 1;
      return 0;
    });
  }, [learnset, moves, searchQuery, filterMethod]);
  
  if (learnset.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
          <Swords className="w-8 h-8 text-muted-foreground/50" />
        </div>
        {t('لا توجد حركات متاحة', 'No moves available')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex gap-2 animate-fade-in-up">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('بحث عن حركة...', 'Search moves...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-9 bg-secondary/50"
          />
        </div>
      </div>
      
      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in-up animation-delay-100">
        {['all', 'level', 'tutor', 'evolution'].map(method => (
          <button
            key={method}
            onClick={() => setFilterMethod(method)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all',
              filterMethod === method 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            )}
          >
            {method === 'all' ? t('الكل', 'All') : t(methodLabels[method as keyof typeof methodLabels].ar, methodLabels[method as keyof typeof methodLabels].en)}
          </button>
        ))}
      </div>
      
      {/* Moves Count */}
      <div className="text-xs text-muted-foreground">
        {t(`عرض ${filteredAndSortedMoves.length} من ${learnset.length} حركة`, `Showing ${filteredAndSortedMoves.length} of ${learnset.length} moves`)}
      </div>
      
      {/* Moves List */}
      <div className="space-y-3">
        {filteredAndSortedMoves.map((entry, idx) => {
          const move = moves.find(m => m.id === entry.move_id);
          if (!move) return null;
          
          const typeColor = `hsl(var(--type-${move.type}))`;
          
          return (
            <Link
              key={`${entry.move_id}-${idx}`}
              to={`/moves/${move.id}`}
              className="block group"
            >
              <div 
                className="relative p-4 rounded-2xl border border-border/30 bg-gradient-to-r from-secondary/40 to-secondary/20 hover:from-secondary/60 hover:to-secondary/40 transition-all duration-300 hover:scale-[1.02] animate-fade-in overflow-hidden"
                style={{ 
                  animationDelay: `${Math.min(idx * 50, 300)}ms`,
                  boxShadow: `inset 0 0 30px ${typeColor}15`
                }}
              >
                {/* Type glow accent */}
                <div 
                  className="absolute top-0 start-0 w-1.5 h-full rounded-s-2xl"
                  style={{ backgroundColor: typeColor }}
                />
                
                <div className="flex items-center justify-between ps-3">
                  {/* Left side - Move info */}
                  <div className="flex items-center gap-4">
                    {/* Type badge with glow */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase shadow-lg transition-transform group-hover:scale-110"
                      style={{ 
                        backgroundColor: typeColor,
                        boxShadow: `0 4px 20px ${typeColor}50`
                      }}
                    >
                      {move.type.slice(0, 3)}
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {t(move.name_ar, move.name_en)}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        {/* Learning method badge */}
                        <span 
                          className={cn(
                            "px-2.5 py-1 text-xs font-semibold rounded-full",
                            entry.method === 'level' && "bg-primary/20 text-primary",
                            entry.method === 'tutor' && "bg-type-psychic/20 text-type-psychic",
                            entry.method === 'evolution' && "bg-gold/20 text-gold"
                          )}
                        >
                          {entry.method === 'level' && entry.level 
                            ? `${t('مستوى', 'Lv.')} ${entry.level}`
                            : t(methodLabels[entry.method].ar, methodLabels[entry.method].en)
                          }
                        </span>
                        
                        {/* Category icon */}
                        <span className="text-lg">{categoryIcons[move.category]}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Stats */}
                  <div className="flex items-center gap-4">
                    {move.power && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">{t('قوة', 'PWR')}</div>
                        <div className="text-xl font-bold text-type-fire">{move.power}</div>
                      </div>
                    )}
                    {move.accuracy && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">{t('دقة', 'ACC')}</div>
                        <div className="text-xl font-bold text-type-water">{move.accuracy}%</div>
                      </div>
                    )}
                    {move.pp && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">PP</div>
                        <div className="text-xl font-bold text-primary">{move.pp}</div>
                      </div>
                    )}
                    
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {filteredAndSortedMoves.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {t('لا توجد حركات مطابقة', 'No matching moves')}
        </div>
      )}
    </div>
  );
}
