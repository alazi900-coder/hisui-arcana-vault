import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { ItemCard } from '@/components/ItemCard';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Item } from '@/types/pokemon';

const itemTypes = ['pokeball', 'medicine', 'berry', 'evolution', 'crafting', 'key', 'other'] as const;

export default function ItemsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const items = useLiveQuery(() => db.items.toArray(), []);

  const filteredItems = items?.filter(item => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      item.name_ar.includes(search) ||
      item.name_en.toLowerCase().includes(searchLower);
    
    const matchesType = !typeFilter || item.type === typeFilter;

    return matchesSearch && matchesType;
  }) || [];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pokeball': return t('كرة', 'Pokéball');
      case 'medicine': return t('دواء', 'Medicine');
      case 'berry': return t('توت', 'Berry');
      case 'evolution': return t('تطور', 'Evolution');
      case 'crafting': return t('تصنيع', 'Crafting');
      case 'key': return t('مفتاح', 'Key');
      default: return t('أخرى', 'Other');
    }
  };

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gradient">
            {t('العناصر', 'Items')}
          </h1>
          <span className="text-sm text-muted-foreground">
            {filteredItems.length} {t('عنصر', 'items')}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ابحث عن عنصر...', 'Search items...')}
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
            <div className="flex flex-wrap gap-2">
              {itemTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm transition-all',
                    typeFilter === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredItems.map((item, i) => (
            <div 
              key={item.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('لا توجد عناصر', 'No items found')}
          </div>
        )}
      </div>
    </div>
  );
}