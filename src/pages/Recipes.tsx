import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { 
  Search, FlaskConical, ArrowRight, Filter, X, Plus, 
  ChevronDown, LayoutGrid, List, Sparkle, Lock, Unlock,
  Circle, Heart, Cherry, Sparkles, Hammer, Key, Package,
  MapPin, ShoppingBag, TreeDeciduous, Mountain, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Item, Recipe } from '@/types/pokemon';
import { cn } from '@/lib/utils';

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

const typeIcons: Record<string, React.ReactNode> = {
  pokeball: <Circle className="w-4 h-4" />,
  medicine: <Heart className="w-4 h-4" />,
  berry: <Cherry className="w-4 h-4" />,
  evolution: <Sparkles className="w-4 h-4" />,
  crafting: <Hammer className="w-4 h-4" />,
  key: <Key className="w-4 h-4" />,
  other: <Package className="w-4 h-4" />,
};

const typeColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  pokeball: { 
    bg: 'bg-destructive/20', 
    text: 'text-destructive',
    border: 'border-destructive/30',
    gradient: 'from-destructive/30 via-destructive/10 to-transparent'
  },
  medicine: { 
    bg: 'bg-type-grass/20', 
    text: 'text-type-grass',
    border: 'border-type-grass/30',
    gradient: 'from-type-grass/30 via-type-grass/10 to-transparent'
  },
  berry: { 
    bg: 'bg-accent/20', 
    text: 'text-accent',
    border: 'border-accent/30',
    gradient: 'from-accent/30 via-accent/10 to-transparent'
  },
  evolution: { 
    bg: 'bg-type-psychic/20', 
    text: 'text-type-psychic',
    border: 'border-type-psychic/30',
    gradient: 'from-type-psychic/30 via-type-psychic/10 to-transparent'
  },
  crafting: { 
    bg: 'bg-type-rock/20', 
    text: 'text-type-rock',
    border: 'border-type-rock/30',
    gradient: 'from-type-rock/30 via-type-rock/10 to-transparent'
  },
  key: { 
    bg: 'bg-gold/20', 
    text: 'text-gold',
    border: 'border-gold/30',
    gradient: 'from-gold/30 via-gold/10 to-transparent'
  },
  other: { 
    bg: 'bg-muted', 
    text: 'text-muted-foreground',
    border: 'border-muted/30',
    gradient: 'from-muted/30 via-muted/10 to-transparent'
  },
};

// How to obtain items based on type
const getObtainMethod = (type: string, t: (ar: string, en: string) => string): { icon: React.ReactNode; text: string } => {
  switch (type) {
    case 'pokeball':
      return { icon: <ShoppingBag className="w-3 h-3" />, text: t('متجر جينكو', 'Ginkgo Cart') };
    case 'medicine':
      return { icon: <FlaskConical className="w-3 h-3" />, text: t('تصنيع', 'Craft') };
    case 'berry':
      return { icon: <TreeDeciduous className="w-3 h-3" />, text: t('أشجار التوت', 'Berry Trees') };
    case 'evolution':
      return { icon: <Mountain className="w-3 h-3" />, text: t('نادر', 'Rare Find') };
    case 'crafting':
      return { icon: <MapPin className="w-3 h-3" />, text: t('جميع المناطق', 'All Areas') };
    default:
      return { icon: <MapPin className="w-3 h-3" />, text: t('متنوع', 'Various') };
  }
};

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'unlocked' | 'locked';

export default function RecipesPage() {
  const { t, lang, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const recipes = useLiveQuery(() => db.recipes.toArray());
  const items = useLiveQuery(() => db.items.toArray());

  const itemsMap = useMemo(() => {
    if (!items) return new Map<string, Item>();
    return new Map(items.map(item => [item.id, item]));
  }, [items]);

  // Get unique output item types
  const availableTypes = useMemo(() => {
    if (!recipes || !items) return [];
    const types = new Set<string>();
    recipes.forEach(recipe => {
      recipe.outputs.forEach(out => {
        const item = itemsMap.get(out.item_id);
        if (item) types.add(item.type);
      });
    });
    return Array.from(types);
  }, [recipes, items, itemsMap]);

  // Type stats
  const typeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    recipes?.forEach(recipe => {
      recipe.outputs.forEach(out => {
        const item = itemsMap.get(out.item_id);
        if (item) {
          stats[item.type] = (stats[item.type] || 0) + 1;
        }
      });
    });
    return stats;
  }, [recipes, itemsMap]);

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    
    return recipes.filter(recipe => {
      // Search filter
      if (searchQuery) {
        const recipeName = lang === 'ar' ? recipe.name_ar : recipe.name_en;
        const matchesName = recipeName.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesIngredient = recipe.ingredients.some(ing => {
          const item = itemsMap.get(ing.item_id);
          const itemName = item ? (lang === 'ar' ? item.name_ar : item.name_en) : '';
          return itemName.toLowerCase().includes(searchQuery.toLowerCase());
        });
        
        const matchesOutput = recipe.outputs.some(out => {
          const item = itemsMap.get(out.item_id);
          const itemName = item ? (lang === 'ar' ? item.name_ar : item.name_en) : '';
          return itemName.toLowerCase().includes(searchQuery.toLowerCase());
        });
        
        if (!matchesName && !matchesIngredient && !matchesOutput) return false;
      }
      
      // Type filter
      if (selectedTypes.length > 0) {
        const outputTypes: string[] = recipe.outputs.map(out => {
          const item = itemsMap.get(out.item_id);
          return item?.type || '';
        });
        if (!selectedTypes.some(selectedType => outputTypes.includes(selectedType))) return false;
      }

      // Unlock filter
      if (filterMode === 'unlocked') {
        const unlockNotes = lang === 'ar' ? recipe.unlock_notes_ar : recipe.unlock_notes_en;
        if (!unlockNotes.toLowerCase().includes('start') && !unlockNotes.includes('البداية')) return false;
      } else if (filterMode === 'locked') {
        const unlockNotes = lang === 'ar' ? recipe.unlock_notes_ar : recipe.unlock_notes_en;
        if (unlockNotes.toLowerCase().includes('start') || unlockNotes.includes('البداية')) return false;
      }
      
      return true;
    });
  }, [recipes, searchQuery, selectedTypes, filterMode, lang, itemsMap]);

  const getItemName = (itemId: string) => {
    const item = itemsMap.get(itemId);
    return item ? (lang === 'ar' ? item.name_ar : item.name_en) : itemId;
  };

  const getItem = (itemId: string) => itemsMap.get(itemId);

  const getItemType = (itemId: string) => {
    const item = itemsMap.get(itemId);
    return item?.type || 'other';
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setFilterMode('all');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pokeball': return t('كرات', 'Balls');
      case 'medicine': return t('أدوية', 'Medicine');
      case 'berry': return t('توت', 'Berries');
      case 'evolution': return t('تطور', 'Evolution');
      case 'crafting': return t('مواد', 'Materials');
      case 'key': return t('مفتاح', 'Key');
      default: return t('أخرى', 'Other');
    }
  };

  const hasActiveFilters = searchQuery || selectedTypes.length > 0 || filterMode !== 'all';

  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="p-4">
        {/* Hero Header */}
        <div className="relative mb-6 p-6 rounded-3xl bg-gradient-to-br from-accent/20 via-primary/10 to-background border border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.15),transparent_50%)]" />
          <div className="absolute top-4 end-4 opacity-20">
            <FlaskConical className="w-24 h-24" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-gradient mb-2">
              {t('الوصفات', 'Recipes')}
            </h1>
            <p className="text-muted-foreground text-sm mb-4">
              {t('تعلم كيفية صنع العناصر في Pokémon Legends: Arceus', 'Learn how to craft items in Pokémon Legends: Arceus')}
            </p>
            
            {/* Stats chips */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm text-sm">
                <FlaskConical className="w-4 h-4 text-accent" />
                {recipes?.length || 0} {t('وصفة', 'recipes')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm text-sm">
                <Sparkle className="w-4 h-4 text-primary" />
                {Object.keys(typeStats).length} {t('أنواع', 'types')}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ابحث عن وصفة أو مكون...', 'Search recipes or ingredients...')}
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
              {hasActiveFilters && (
                <span className="px-1.5 py-0.5 text-xs bg-background/20 rounded-md">
                  {selectedTypes.length + (filterMode !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Unlock Filter */}
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl">
              <button
                onClick={() => setFilterMode('all')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  filterMode === 'all' 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('الكل', 'All')}
              </button>
              <button
                onClick={() => setFilterMode('unlocked')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  filterMode === 'unlocked' 
                    ? 'bg-background text-type-grass shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Unlock className="w-3.5 h-3.5" />
                {t('مفتوح', 'Unlocked')}
              </button>
              <button
                onClick={() => setFilterMode('locked')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  filterMode === 'locked' 
                    ? 'bg-background text-destructive shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Lock className="w-3.5 h-3.5" />
                {t('مقفل', 'Locked')}
              </button>
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
              <span className="text-sm font-medium">{t('فلترة حسب نوع الناتج', 'Filter by Output Type')}</span>
              {selectedTypes.length > 0 && (
                <button
                  onClick={() => setSelectedTypes([])}
                  className="ms-auto text-xs text-primary hover:underline"
                >
                  {t('مسح', 'Clear')}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableTypes.map(type => {
                const colors = typeColors[type] || typeColors.other;
                const isActive = selectedTypes.includes(type);
                const count = typeStats[type] || 0;
                
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-3 rounded-xl transition-all border',
                      isActive
                        ? `${colors.bg} ${colors.text} ${colors.border}`
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
            {t('عرض', 'Showing')} {filteredRecipes.length} {t('من', 'of')} {recipes?.length || 0} {t('وصفة', 'recipes')}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              {t('مسح الفلاتر', 'Clear filters')}
            </button>
          )}
        </div>

        {/* Recipes */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecipes.map((recipe, i) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                itemsMap={itemsMap}
                delay={i * 50}
                isExpanded={expandedRecipe === recipe.id}
                onToggleExpand={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecipes.map((recipe, i) => (
              <RecipeListCard 
                key={recipe.id} 
                recipe={recipe} 
                itemsMap={itemsMap}
                delay={i * 30}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <FlaskConical className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg font-medium">
              {t('لا توجد وصفات', 'No recipes found')}
            </p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              {t('جرب تغيير معايير البحث', 'Try adjusting your search criteria')}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
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

// Recipe Card Component
function RecipeCard({ 
  recipe, 
  itemsMap, 
  delay,
  isExpanded,
  onToggleExpand
}: { 
  recipe: Recipe; 
  itemsMap: Map<string, Item>; 
  delay: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const { t, lang } = useLanguage();
  const mainOutput = recipe.outputs[0];
  const mainItem = mainOutput ? itemsMap.get(mainOutput.item_id) : null;
  const outputType = mainItem?.type || 'other';
  const colors = typeColors[outputType] || typeColors.other;

  const isUnlocked = recipe.unlock_notes_en.toLowerCase().includes('start') || 
                     recipe.unlock_notes_ar.includes('البداية');

  return (
    <div 
      className={cn(
        'rounded-2xl border overflow-hidden transition-all animate-fade-in-up',
        colors.border,
        'bg-card/50 hover:bg-card'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className={cn('p-4 bg-gradient-to-r', colors.gradient)}>
        <div className="flex items-start gap-4">
          {/* Output Image */}
          <div className={cn(
            'relative w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border',
            colors.bg,
            colors.border
          )}>
            {mainItem && (
              <img
                src={getItemSpriteUrl(mainItem.name_en)}
                alt={lang === 'ar' ? mainItem.name_ar : mainItem.name_en}
                className="w-12 h-12 object-contain drop-shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            {mainOutput && mainOutput.qty > 1 && (
              <span className={cn(
                'absolute -bottom-1 -end-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center',
                colors.bg,
                colors.text
              )}>
                ×{mainOutput.qty}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground truncate">
              {lang === 'ar' ? recipe.name_ar : recipe.name_en}
            </h3>
            
            {/* Output items */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {recipe.outputs.map((out, idx) => {
                const item = itemsMap.get(out.item_id);
                if (!item) return null;
                return (
                  <Link
                    key={idx}
                    to={`/items/${item.id}`}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium transition-colors',
                      colors.bg, colors.text,
                      'hover:opacity-80'
                    )}
                  >
                    {lang === 'ar' ? item.name_ar : item.name_en}
                    {out.qty > 1 && ` ×${out.qty}`}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Unlock Status */}
          <div className={cn(
            'shrink-0 p-2 rounded-lg',
            isUnlocked ? 'bg-type-grass/20 text-type-grass' : 'bg-muted text-muted-foreground'
          )}>
            {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-medium">{t('المكونات المطلوبة:', 'Required Ingredients:')}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {recipe.ingredients.map((ing, idx) => {
            const item = itemsMap.get(ing.item_id);
            if (!item) return null;
            const ingType = item.type || 'other';
            const ingColors = typeColors[ingType] || typeColors.other;

            return (
              <div key={idx} className="flex items-center gap-1">
                {idx > 0 && <Plus className="w-3 h-3 text-muted-foreground" />}
                <Link
                  to={`/items/${item.id}`}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all border',
                    'bg-background/50 hover:bg-background',
                    ingColors.border
                  )}
                >
                  <img
                    src={getItemSpriteUrl(item.name_en)}
                    alt={lang === 'ar' ? item.name_ar : item.name_en}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-sm font-medium">{lang === 'ar' ? item.name_ar : item.name_en}</span>
                  <span className="text-xs text-muted-foreground">×{ing.qty}</span>
                </Link>
              </div>
            );
          })}

          <ArrowRight className="w-4 h-4 text-primary mx-2 rtl:rotate-180" />
          
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border',
            colors.bg,
            colors.border,
            colors.text
          )}>
            <FlaskConical className="w-4 h-4" />
            <span className="text-sm font-bold">{t('صناعة', 'Craft')}</span>
          </div>
        </div>

        {/* Expand for more details */}
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-1 text-xs text-primary mt-3 hover:underline"
        >
          <Info className="w-3 h-3" />
          {isExpanded ? t('إخفاء التفاصيل', 'Hide details') : t('عرض كيفية الحصول على المواد', 'Show how to obtain materials')}
          <ChevronDown className={cn('w-3 h-3 transition-transform', isExpanded && 'rotate-180')} />
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/30 space-y-3 animate-fade-in-up">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {t('كيفية الحصول على المواد:', 'How to obtain materials:')}
            </h4>
            
            {recipe.ingredients.map((ing, idx) => {
              const item = itemsMap.get(ing.item_id);
              if (!item) return null;
              const obtainMethod = getObtainMethod(item.type, t);

              return (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30"
                >
                  <img
                    src={getItemSpriteUrl(item.name_en)}
                    alt={lang === 'ar' ? item.name_ar : item.name_en}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="flex-1">
                    <Link to={`/items/${item.id}`} className="font-medium hover:text-primary transition-colors">
                      {lang === 'ar' ? item.name_ar : item.name_en}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      {obtainMethod.icon}
                      <span>{obtainMethod.text}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary">×{ing.qty}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Unlock Notes */}
        <div className={cn(
          'flex items-center gap-2 mt-3 pt-3 border-t border-border/30 text-xs',
          isUnlocked ? 'text-type-grass' : 'text-muted-foreground'
        )}>
          {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          <span>{lang === 'ar' ? recipe.unlock_notes_ar : recipe.unlock_notes_en}</span>
        </div>
      </div>
    </div>
  );
}

// Recipe List Card Component
function RecipeListCard({ 
  recipe, 
  itemsMap, 
  delay 
}: { 
  recipe: Recipe; 
  itemsMap: Map<string, Item>; 
  delay: number;
}) {
  const { t, lang } = useLanguage();
  const mainOutput = recipe.outputs[0];
  const mainItem = mainOutput ? itemsMap.get(mainOutput.item_id) : null;
  const outputType = mainItem?.type || 'other';
  const colors = typeColors[outputType] || typeColors.other;

  const isUnlocked = recipe.unlock_notes_en.toLowerCase().includes('start') || 
                     recipe.unlock_notes_ar.includes('البداية');

  return (
    <div 
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border transition-all animate-fade-in-up',
        'bg-card/50 hover:bg-card',
        colors.border
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Output Image */}
      <div className={cn(
        'relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border',
        colors.bg,
        colors.border
      )}>
        {mainItem && (
          <img
            src={getItemSpriteUrl(mainItem.name_en)}
            alt={lang === 'ar' ? mainItem.name_ar : mainItem.name_en}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">
          {lang === 'ar' ? recipe.name_ar : recipe.name_en}
        </h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {recipe.ingredients.slice(0, 3).map((ing, idx) => {
            const item = itemsMap.get(ing.item_id);
            if (!item) return null;
            return (
              <span key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                {idx > 0 && '+'}
                <img
                  src={getItemSpriteUrl(item.name_en)}
                  alt=""
                  className="w-4 h-4 object-contain inline"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {ing.qty}×
              </span>
            );
          })}
          {recipe.ingredients.length > 3 && (
            <span className="text-xs text-muted-foreground">+{recipe.ingredients.length - 3}</span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className={cn(
        'shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5',
        isUnlocked ? 'bg-type-grass/20 text-type-grass' : 'bg-muted text-muted-foreground'
      )}>
        {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
        {isUnlocked ? t('مفتوح', 'Unlocked') : t('مقفل', 'Locked')}
      </div>
    </div>
  );
}
