import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, FlaskConical, ArrowRight, ChevronLeft, 
  Filter, X, Sparkles, Plus, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Item, Recipe } from '@/types/pokemon';

const itemTypeColors: Record<string, { bg: string; border: string; glow: string }> = {
  medicine: { bg: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', glow: 'shadow-pink-500/20' },
  pokeball: { bg: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
  battle: { bg: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' },
  evolution: { bg: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  berry: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', glow: 'shadow-green-500/20' },
  material: { bg: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
  key: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  other: { bg: 'from-gray-500/20 to-slate-500/20', border: 'border-gray-500/30', glow: 'shadow-gray-500/20' },
};

const getItemSpriteUrl = (itemId: string) => {
  const formattedId = itemId.replace(/-/g, '-').toLowerCase();
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${formattedId}.png`;
};

export default function Recipes() {
  const { t, lang, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

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
  }, [recipes, itemsMap]);

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    
    return recipes.filter(recipe => {
      // Search filter
      if (searchQuery) {
        const recipeName = lang === 'ar' ? recipe.name_ar : recipe.name_en;
        const matchesName = recipeName.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Also search in ingredients and outputs
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
      
      return true;
    });
  }, [recipes, searchQuery, selectedTypes, lang, itemsMap]);

  const getItemName = (itemId: string) => {
    const item = itemsMap.get(itemId);
    return item ? (lang === 'ar' ? item.name_ar : item.name_en) : itemId;
  };

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
  };

  const typeLabels: Record<string, { ar: string; en: string }> = {
    medicine: { ar: 'أدوية', en: 'Medicine' },
    pokeball: { ar: 'كرات بوكيمون', en: 'Poké Balls' },
    battle: { ar: 'معركة', en: 'Battle' },
    evolution: { ar: 'تطور', en: 'Evolution' },
    berry: { ar: 'توت', en: 'Berry' },
    material: { ar: 'مواد', en: 'Materials' },
    key: { ar: 'مفتاح', en: 'Key' },
    other: { ar: 'أخرى', en: 'Other' },
  };

  const hasActiveFilters = searchQuery || selectedTypes.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container flex items-center gap-3 h-14 px-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h1 className="font-bold text-lg">{t('الوصفات', 'Recipes')}</h1>
          </div>
          {recipes && (
            <Badge variant="secondary" className="ml-auto">
              {filteredRecipes.length} / {recipes.length}
            </Badge>
          )}
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <Input
              placeholder={t('ابحث عن وصفة أو مكون...', 'Search recipes or ingredients...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {t('النوع', 'Type')}
                  {selectedTypes.length > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {selectedTypes.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t('نوع الناتج', 'Output Type')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableTypes.map(type => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => toggleType(type)}
                  >
                    {lang === 'ar' ? typeLabels[type]?.ar : typeLabels[type]?.en || type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {selectedTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTypes.map(type => (
              <Badge 
                key={type} 
                variant="secondary" 
                className="gap-1 cursor-pointer hover:bg-destructive/20"
                onClick={() => toggleType(type)}
              >
                {lang === 'ar' ? typeLabels[type]?.ar : typeLabels[type]?.en || type}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => {
            const mainOutput = recipe.outputs[0];
            const mainOutputType = getItemType(mainOutput?.item_id || '');
            const colors = itemTypeColors[mainOutputType] || itemTypeColors.other;

            return (
              <Card 
                key={recipe.id} 
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 border ${colors.border} hover:scale-[1.02]`}
              >
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${colors.bg} p-4 border-b border-border/30`}>
                    <div className="flex items-center gap-3">
                      {/* Output Item Image */}
                      <div className={`relative w-16 h-16 rounded-xl bg-background/50 flex items-center justify-center shadow-lg ${colors.glow}`}>
                        <img
                          src={getItemSpriteUrl(mainOutput?.item_id || '')}
                          alt={getItemName(mainOutput?.item_id || '')}
                          className="w-12 h-12 object-contain drop-shadow-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'fallback-icon';
                              fallback.innerHTML = '<svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                        {mainOutput && mainOutput.qty > 1 && (
                          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {mainOutput.qty}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">
                          {lang === 'ar' ? recipe.name_ar : recipe.name_en}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recipe.outputs.map((out, idx) => (
                            <Link 
                              key={idx} 
                              to={`/items/${out.item_id}`}
                              className="hover:underline"
                            >
                              <Badge variant="secondary" className="text-xs">
                                {getItemName(out.item_id)}
                                {out.qty > 1 && ` ×${out.qty}`}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Sparkles className="h-4 w-4" />
                      <span>{t('المكونات المطلوبة:', 'Required Ingredients:')}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {recipe.ingredients.map((ing, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Link 
                            to={`/items/${ing.item_id}`}
                            className="flex items-center gap-2 bg-muted/50 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors"
                          >
                            <img
                              src={getItemSpriteUrl(ing.item_id)}
                              alt={getItemName(ing.item_id)}
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <span className="text-sm font-medium">{getItemName(ing.item_id)}</span>
                            <span className="text-xs text-muted-foreground">×{ing.qty}</span>
                          </Link>
                          {idx < recipe.ingredients.length - 1 && (
                            <Plus className="h-3 w-3 text-muted-foreground mx-1" />
                          )}
                        </div>
                      ))}
                      
                      <ArrowRight className={`h-4 w-4 text-primary mx-2 ${isRTL ? 'rotate-180' : ''}`} />
                      
                      <div className="flex items-center gap-1 bg-primary/10 rounded-lg px-2 py-1.5">
                        <FlaskConical className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold text-primary">
                          {t('صناعة', 'Craft')}
                        </span>
                      </div>
                    </div>

                    {/* Unlock Notes */}
                    {recipe.unlock_notes_ar && (
                      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
                        💡 {lang === 'ar' ? recipe.unlock_notes_ar : recipe.unlock_notes_en}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <FlaskConical className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {t('لا توجد وصفات', 'No recipes found')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('جرب تغيير معايير البحث', 'Try adjusting your search criteria')}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                {t('مسح الفلاتر', 'Clear Filters')}
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}