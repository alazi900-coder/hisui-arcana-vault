import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { MoveCard } from '@/components/MoveCard';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PokemonType, MoveCategory } from '@/types/pokemon';

const types: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const categories: MoveCategory[] = ['physical', 'special', 'status'];

export default function MovesPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<MoveCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const moves = useLiveQuery(() => db.moves.toArray(), []);

  const filteredMoves = moves?.filter(move => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      move.name_ar.includes(search) ||
      move.name_en.toLowerCase().includes(searchLower);
    
    const matchesType = !typeFilter || move.type === typeFilter;
    const matchesCategory = !categoryFilter || move.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  }) || [];

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gradient">
            {t('الحركات', 'Moves')}
          </h1>
          <span className="text-sm text-muted-foreground">
            {filteredMoves.length} {t('حركة', 'moves')}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ابحث عن حركة...', 'Search moves...')}
            className="ps-10 bg-secondary/50 border-border/50"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm mb-4 transition-colors',
            showFilters ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
          )}
        >
          <Filter className="w-4 h-4" />
          {t('فلاتر', 'Filters')}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-4 mb-6 animate-fade-in-up">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t('الفئة', 'Category')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm capitalize transition-all',
                      categoryFilter === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    )}
                  >
                    {t(
                      cat === 'physical' ? 'فيزيائي' : cat === 'special' ? 'خاص' : 'حالة',
                      cat
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t('النوع', 'Type')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                    className={cn(
                      'px-2 py-1 rounded-full text-xs capitalize transition-all',
                      typeFilter === type ? 'ring-2 ring-primary' : ''
                    )}
                    style={{
                      backgroundColor: `hsl(var(--type-${type}) / 0.2)`,
                      color: `hsl(var(--type-${type}))`
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Moves Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredMoves.map((move, i) => (
            <div 
              key={move.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <MoveCard move={move} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredMoves.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('لا توجد حركات', 'No moves found')}
          </div>
        )}
      </div>
    </div>
  );
}