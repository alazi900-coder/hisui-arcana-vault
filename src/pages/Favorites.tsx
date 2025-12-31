import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, toggleFavorite } from '@/lib/db';
import { PokemonCard } from '@/components/PokemonCard';
import { MoveCard } from '@/components/MoveCard';
import { ItemCard } from '@/components/ItemCard';
import { Heart, Star, Swords, Package, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function FavoritesPage() {
  const { t } = useLanguage();

  const favorites = useLiveQuery(() => 
    db.favorites.orderBy('addedAt').reverse().toArray()
  );

  const pokemonFavorites = useLiveQuery(async () => {
    const favs = await db.favorites.where('type').equals('pokemon').toArray();
    const ids = favs.map(f => f.id);
    return db.pokemon.where('id').anyOf(ids).toArray();
  });

  const moveFavorites = useLiveQuery(async () => {
    const favs = await db.favorites.where('type').equals('move').toArray();
    const ids = favs.map(f => f.id);
    return db.moves.where('id').anyOf(ids).toArray();
  });

  const itemFavorites = useLiveQuery(async () => {
    const favs = await db.favorites.where('type').equals('item').toArray();
    const ids = favs.map(f => f.id);
    return db.items.where('id').anyOf(ids).toArray();
  });

  const handleRemoveFavorite = async (type: 'pokemon' | 'move' | 'item', id: string) => {
    await toggleFavorite(type, id);
    toast.success(t('تمت الإزالة من المفضلة', 'Removed from favorites'));
  };

  const totalFavorites = (pokemonFavorites?.length || 0) + (moveFavorites?.length || 0) + (itemFavorites?.length || 0);

  return (
    <div className="pb-20 pt-4 min-h-screen">
      <div className="container px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-gold/20 to-accent/20">
            <Heart className="w-6 h-6 text-gold fill-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              {t('المفضلة', 'Favorites')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(`${totalFavorites} عنصر محفوظ`, `${totalFavorites} items saved`)}
            </p>
          </div>
        </div>

        {totalFavorites === 0 ? (
          <div className="text-center py-16">
            <Star className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {t('لا توجد مفضلات بعد', 'No favorites yet')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('اضغط على نجمة أي عنصر لإضافته هنا', 'Tap the star on any item to add it here')}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="pokemon" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
              <TabsTrigger value="pokemon" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">{t('بوكيمون', 'Pokémon')}</span>
                <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                  {pokemonFavorites?.length || 0}
                </span>
              </TabsTrigger>
              <TabsTrigger value="moves" className="flex items-center gap-2">
                <Swords className="w-4 h-4" />
                <span className="hidden sm:inline">{t('حركات', 'Moves')}</span>
                <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                  {moveFavorites?.length || 0}
                </span>
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">{t('عناصر', 'Items')}</span>
                <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                  {itemFavorites?.length || 0}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pokemon" className="space-y-4">
              {pokemonFavorites?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('لا توجد بوكيمونات مفضلة', 'No favorite Pokémon')}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {pokemonFavorites?.map((p, i) => (
                    <div key={p.id} className="relative group animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <PokemonCard pokemon={p} />
                      <button
                        onClick={() => handleRemoveFavorite('pokemon', p.id)}
                        className="absolute top-2 end-2 p-1.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="moves" className="space-y-4">
              {moveFavorites?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('لا توجد حركات مفضلة', 'No favorite moves')}
                </div>
              ) : (
                <div className="grid gap-3">
                  {moveFavorites?.map((m, i) => (
                    <div key={m.id} className="relative group animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <MoveCard move={m} />
                      <button
                        onClick={() => handleRemoveFavorite('move', m.id)}
                        className="absolute top-2 end-2 p-1.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              {itemFavorites?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('لا توجد عناصر مفضلة', 'No favorite items')}
                </div>
              ) : (
                <div className="grid gap-3">
                  {itemFavorites?.map((item, i) => (
                    <div key={item.id} className="relative group animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <ItemCard item={item} />
                      <button
                        onClick={() => handleRemoveFavorite('item', item.id)}
                        className="absolute top-2 end-2 p-1.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
