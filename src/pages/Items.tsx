import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { ItemCard } from '@/components/ItemCard';
import { Input } from '@/components/ui/input';
import { 
  Search, Filter, ChevronDown, LayoutGrid, List, 
  Circle, Heart, Cherry, Sparkles, Hammer, Key, Package,
  SortAsc, SortDesc, Sparkle, FlaskConical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import type { Item } from '@/types/pokemon';

// PokeAPI item sprites base URL
const ITEM_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

const getItemSpriteUrl = (itemName: string): string => {
  const spriteName = itemName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/é/g, 'e')
    .replace(/['']/g, '')
    .replace(/\./g, '');
  return `${ITEM_SPRITE_BASE}/${spriteName}.png`;
};

const itemTypes = ['pokeball', 'medicine', 'berry', 'evolution', 'crafting', 'key', 'other'] as const;

const typeIcons: Record<string, React.ReactNode> = {
  pokeball: <Circle className="w-4 h-4" />,
  medicine: <Heart className="w-4 h-4" />,
  berry: <Cherry className="w-4 h-4" />,
  evolution: <Sparkles className="w-4 h-4" />,
  crafting: <Hammer className="w-4 h-4" />,
  key: <Key className="w-4 h-4" />,
  other: <Package className="w-4 h-4" />,
};

const typeColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  pokeball: { 
    bg: 'bg-destructive/20', 
    text: 'text-destructive',
    border: 'border-destructive/30',
    glow: 'shadow-[0_0_20px_hsl(var(--destructive)/0.3)]'
  },
  medicine: { 
    bg: 'bg-type-grass/20', 
    text: 'text-type-grass',
    border: 'border-type-grass/30',
    glow: 'shadow-[0_0_20px_hsl(var(--type-grass)/0.3)]'
  },
  berry: { 
    bg: 'bg-accent/20', 
    text: 'text-accent',
    border: 'border-accent/30',
    glow: 'shadow-[0_0_20px_hsl(var(--accent)/0.3)]'
  },
  evolution: { 
    bg: 'bg-type-psychic/20', 
    text: 'text-type-psychic',
    border: 'border-type-psychic/30',
    glow: 'shadow-[0_0_20px_hsl(var(--type-psychic)/0.3)]'
  },
  crafting: { 
    bg: 'bg-type-rock/20', 
    text: 'text-type-rock',
    border: 'border-type-rock/30',
    glow: 'shadow-[0_0_20px_hsl(var(--type-rock)/0.3)]'
  },
  key: { 
    bg: 'bg-gold/20', 
    text: 'text-gold',
    border: 'border-gold/30',
    glow: 'shadow-[0_0_20px_hsl(var(--gold)/0.3)]'
  },
  other: { 
    bg: 'bg-muted', 
    text: 'text-muted-foreground',
    border: 'border-muted/30',
    glow: 'shadow-[0_0_15px_hsl(var(--muted)/0.2)]'
  },
};

type SortOption = 'name_asc' | 'name_desc' | 'type';
type ViewMode = 'grid' | 'list';

export default function ItemsPage() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('type');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const items = useLiveQuery(() => db.items.toArray(), []);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = items?.filter(item => {
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
        item.name_ar.includes(search) ||
        item.name_en.toLowerCase().includes(searchLower) ||
        item.description_ar.includes(search) ||
        item.description_en.toLowerCase().includes(searchLower);
      
      const matchesType = !typeFilter || item.type === typeFilter;

      return matchesSearch && matchesType;
    }) || [];

    // Sort items
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return lang === 'ar' 
            ? a.name_ar.localeCompare(b.name_ar, 'ar')
            : a.name_en.localeCompare(b.name_en, 'en');
        case 'name_desc':
          return lang === 'ar'
            ? b.name_ar.localeCompare(a.name_ar, 'ar')
            : b.name_en.localeCompare(a.name_en, 'en');
        case 'type':
          return itemTypes.indexOf(a.type as typeof itemTypes[number]) - itemTypes.indexOf(b.type as typeof itemTypes[number]);
        default:
          return 0;
      }
    });

    return result;
  }, [items, search, typeFilter, sortBy, lang]);

  // Group items by type for category view
  const groupedItems = useMemo(() => {
    const groups: Record<string, Item[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.type]) {
        groups[item.type] = [];
      }
      groups[item.type].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Get type stats
  const typeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    items?.forEach(item => {
      stats[item.type] = (stats[item.type] || 0) + 1;
    });
    return stats;
  }, [items]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pokeball': return t('كرات البوكيمون', 'Poké Balls');
      case 'medicine': return t('الأدوية', 'Medicine');
      case 'berry': return t('التوت', 'Berries');
      case 'evolution': return t('أحجار التطور', 'Evolution Items');
      case 'crafting': return t('مواد التصنيع', 'Crafting Materials');
      case 'key': return t('عناصر المفتاح', 'Key Items');
      default: return t('أخرى', 'Other');
    }
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'name_asc': return t('الاسم (أ-ي)', 'Name (A-Z)');
      case 'name_desc': return t('الاسم (ي-أ)', 'Name (Z-A)');
      case 'type': return t('حسب النوع', 'By Type');
    }
  };

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Hero Header */}
        <div className="relative mb-6 p-6 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-background border border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="absolute top-4 end-4 opacity-20">
            <Package className="w-24 h-24" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gradient">
                {t('العناصر', 'Items')}
              </h1>
              <Link 
                to="/recipes"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/20 text-accent border border-accent/30 text-sm font-medium hover:bg-accent/30 transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                {t('الوصفات', 'Recipes')}
              </Link>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {t('استكشف جميع العناصر في Pokémon Legends: Arceus', 'Explore all items in Pokémon Legends: Arceus')}
            </p>
            
            {/* Stats chips */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm text-sm">
                <Sparkle className="w-4 h-4 text-primary" />
                {items?.length || 0} {t('عنصر', 'items')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm text-sm">
                <LayoutGrid className="w-4 h-4 text-accent" />
                {Object.keys(typeStats).length} {t('فئات', 'categories')}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Controls */}
        <div className="space-y-3 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('ابحث عن عنصر...', 'Search items...')}
              className="ps-11 h-12 bg-secondary/50 border-border/50 rounded-xl text-base"
            />
          </div>

          {/* Control bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                showFilters 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              )}
            >
              <Filter className="w-4 h-4" />
              {t('فلاتر', 'Filters')}
              {typeFilter && (
                <span className="px-1.5 py-0.5 text-xs bg-background/20 rounded-md">1</span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors"
              >
                {sortBy === 'name_asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                {getSortLabel(sortBy)}
                <ChevronDown className={cn("w-4 h-4 transition-transform", showSortMenu && "rotate-180")} />
              </button>
              
              {showSortMenu && (
                <div className="absolute top-full mt-2 start-0 z-50 min-w-[160px] bg-card border border-border rounded-xl shadow-xl p-1 animate-fade-in-up">
                  {(['type', 'name_asc', 'name_desc'] as SortOption[]).map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortMenu(false);
                      }}
                      className={cn(
                        'w-full text-start px-3 py-2 rounded-lg text-sm transition-colors',
                        sortBy === option 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-secondary text-foreground'
                      )}
                    >
                      {getSortLabel(option)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="ms-auto flex items-center gap-1 p-1 bg-secondary rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list' 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Type Filters */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-2xl bg-secondary/30 border border-border/30 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t('فلترة حسب النوع', 'Filter by Type')}</span>
              {typeFilter && (
                <button
                  onClick={() => setTypeFilter(null)}
                  className="ms-auto text-xs text-primary hover:underline"
                >
                  {t('مسح الفلتر', 'Clear filter')}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {itemTypes.map(type => {
                const colors = typeColors[type];
                const isActive = typeFilter === type;
                const count = typeStats[type] || 0;
                
                return (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-3 rounded-xl transition-all border',
                      isActive
                        ? `${colors.bg} ${colors.text} ${colors.border} ${colors.glow}`
                        : 'bg-background/50 border-border/30 text-muted-foreground hover:bg-background/80'
                    )}
                  >
                    {typeIcons[type]}
                    <span className="text-sm font-medium flex-1 text-start">{getTypeLabel(type)}</span>
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded-md',
                      isActive ? 'bg-background/30' : 'bg-secondary'
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            {t('عرض', 'Showing')} {filteredItems.length} {t('من', 'of')} {items?.length || 0} {t('عنصر', 'items')}
          </span>
        </div>

        {/* Items Display */}
        {sortBy === 'type' && !typeFilter ? (
          // Grouped by type view
          <div className="space-y-8">
            {itemTypes.map(type => {
              const typeItems = groupedItems[type];
              if (!typeItems?.length) return null;
              
              const colors = typeColors[type];
              
              return (
                <div key={type} className="animate-fade-in-up">
                  {/* Category Header */}
                  <div className={cn(
                    'flex items-center gap-3 mb-4 p-3 rounded-xl border',
                    colors.bg,
                    colors.border
                  )}>
                    <div className={cn('p-2 rounded-lg', colors.bg, colors.text)}>
                      {typeIcons[type]}
                    </div>
                    <div>
                      <h2 className={cn('font-semibold', colors.text)}>
                        {getTypeLabel(type)}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {typeItems.length} {t('عنصر', 'items')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Items */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {typeItems.map((item, i) => (
                        <div 
                          key={item.id} 
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${i * 30}ms` }}
                        >
                          <ItemCard item={item} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {typeItems.map((item, i) => (
                        <ItemListCard key={item.id} item={item} delay={i * 20} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Flat view (when not sorted by type or filtered)
          viewMode === 'grid' ? (
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
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item, i) => (
                <ItemListCard key={item.id} item={item} delay={i * 20} />
              ))}
            </div>
          )
        )}

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg font-medium">
              {t('لا توجد عناصر', 'No items found')}
            </p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              {t('جرب تغيير معايير البحث', 'Try adjusting your search criteria')}
            </p>
            {(search || typeFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter(null);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {t('مسح الفلاتر', 'Clear filters')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// List view item card
function ItemListCard({ item, delay }: { item: Item; delay: number }) {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const colors = typeColors[item.type] || typeColors.other;
  const spriteUrl = getItemSpriteUrl(item.name_en);

  const getShortTypeLabel = (type: string) => {
    switch (type) {
      case 'pokeball': return t('كرة', 'Ball');
      case 'medicine': return t('دواء', 'Medicine');
      case 'berry': return t('توت', 'Berry');
      case 'evolution': return t('تطور', 'Evolution');
      case 'crafting': return t('تصنيع', 'Crafting');
      case 'key': return t('مفتاح', 'Key');
      default: return t('أخرى', 'Other');
    }
  };

  return (
    <Link 
      to={`/items/${item.id}`}
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn(
        'flex items-center gap-4 p-4 rounded-xl border transition-all',
        'bg-card/50 border-border/30',
        'hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        'group'
      )}>
        {/* Item Image */}
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border',
          colors.bg,
          colors.border
        )}>
          {!imgError ? (
            <img 
              src={spriteUrl}
              alt={t(item.name_ar, item.name_en)}
              className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className={colors.text}>
              {typeIcons[item.type]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {t(item.name_ar, item.name_en)}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
            {t(item.description_ar, item.description_en)}
          </p>
        </div>

        {/* Type Badge */}
        <span className={cn(
          'shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border',
          colors.bg,
          colors.text,
          colors.border
        )}>
          {typeIcons[item.type]}
          {getShortTypeLabel(item.type)}
        </span>
      </div>
    </Link>
  );
}
