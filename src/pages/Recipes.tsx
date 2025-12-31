import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, FlaskConical, ArrowRight, ArrowLeft, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Recipes() {
  const { t, lang, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const recipes = useLiveQuery(() => db.recipes.toArray());
  const items = useLiveQuery(() => db.items.toArray());

  const itemsMap = useMemo(() => {
    if (!items) return new Map();
    return new Map(items.map(item => [item.id, item]));
  }, [items]);

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    
    return recipes.filter(recipe => {
      if (!searchQuery) return true;
      
      const recipeName = lang === 'ar' ? recipe.name_ar : recipe.name_en;
      return recipeName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [recipes, searchQuery, lang]);

  const getItemName = (itemId: string) => {
    const item = itemsMap.get(itemId);
    return item ? (lang === 'ar' ? item.name_ar : item.name_en) : itemId;
  };

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
          <h1 className="font-bold text-lg">{t('الوصفات', 'Recipes')}</h1>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('ابحث عن وصفة...', 'Search recipes...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Output */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">
                        {lang === 'ar' ? recipe.name_ar : recipe.name_en}
                      </h3>
                    </div>

                    {/* Outputs */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">{t('الناتج:', 'Output:')}</span>
                      {recipe.outputs.map((out, idx) => (
                        <Badge key={idx} variant="secondary">
                          {getItemName(out.item_id)} x{out.qty}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Ingredients */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-muted-foreground">{t('المكونات:', 'Ingredients:')}</span>
                      {recipe.ingredients.map((ing, idx) => (
                        <span key={idx} className="text-sm text-muted-foreground">
                          {getItemName(ing.item_id)} x{ing.qty}
                          {idx < recipe.ingredients.length - 1 && ' + '}
                        </span>
                      ))}
                    </div>

                    {recipe.unlock_notes_ar && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {lang === 'ar' ? recipe.unlock_notes_ar : recipe.unlock_notes_en}
                      </p>
                    )}
                  </div>

                  {isRTL ? (
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('لا توجد وصفات', 'No recipes found')}
          </div>
        )}
      </main>
    </div>
  );
}
