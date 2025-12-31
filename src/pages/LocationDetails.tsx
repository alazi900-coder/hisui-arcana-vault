import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addRecent } from '@/lib/db';
import { ChevronLeft, MapPin, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PokemonCard } from '@/components/PokemonCard';

const rarityColors = {
  common: 'text-muted-foreground',
  uncommon: 'text-type-grass',
  rare: 'text-primary',
  very_rare: 'text-gold',
};

export default function LocationDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);
  const [alphaOnly, setAlphaOnly] = useState(false);

  const location = useLiveQuery(() => db.locations.get(id || ''), [id]);

  // Track recent view
  useEffect(() => {
    if (id) {
      addRecent('location', id);
    }
  }, [id]);
  const spawns = useLiveQuery(() => 
    db.spawns.where('location_id').equals(id || '').toArray(), 
    [id]
  );
  const pokemon = useLiveQuery(() => db.pokemon.toArray(), []);

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  const filteredSpawns = spawns?.filter(spawn => {
    const matchesRarity = !rarityFilter || spawn.rarity === rarityFilter;
    const matchesAlpha = !alphaOnly || spawn.is_alpha;
    return matchesRarity && matchesAlpha;
  }) || [];

  const getPokemonById = (pokemonId: string) => 
    pokemon?.find(p => p.id === pokemonId);

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return t('شائع', 'Common');
      case 'uncommon': return t('غير شائع', 'Uncommon');
      case 'rare': return t('نادر', 'Rare');
      case 'very_rare': return t('نادر جداً', 'Very Rare');
      default: return rarity;
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-16">
      {/* Header */}
      <div className="relative h-40 flex items-end bg-gradient-to-br from-primary/20 to-accent/10 p-4">
        {/* Back button */}
        <Link 
          to="/locations" 
          className="absolute top-4 start-4 p-2 rounded-full glass hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </Link>

        <div>
          <span className="text-xs text-primary uppercase tracking-wider">
            {t('هيسوي', 'Hisui')}
          </span>
          <h1 className="text-2xl font-bold text-foreground">
            {t(location.name_ar, location.name_en)}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Description */}
        <div className="glass rounded-xl p-4 mb-6">
          <p className="text-muted-foreground">
            {t(location.description_ar, location.description_en)}
          </p>
        </div>

        {/* Subareas */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t('المناطق الفرعية', 'Subareas')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {location.subareas.map((subarea, i) => (
              <span 
                key={i}
                className="px-3 py-1.5 rounded-full bg-secondary text-sm text-foreground"
              >
                {t(subarea.name_ar, subarea.name_en)}
              </span>
            ))}
          </div>
        </div>

        {/* Pokemon in this location */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {t('البوكيمونات', 'Pokémon')}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredSpawns.length} {t('نوع', 'species')}
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setAlphaOnly(!alphaOnly)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm transition-all',
                alphaOnly 
                  ? 'bg-destructive/20 text-destructive' 
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {t('ألفا فقط', 'Alpha Only')}
            </button>
            {['common', 'uncommon', 'rare', 'very_rare'].map(rarity => (
              <button
                key={rarity}
                onClick={() => setRarityFilter(rarityFilter === rarity ? null : rarity)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm transition-all',
                  rarityFilter === rarity
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                {getRarityLabel(rarity)}
              </button>
            ))}
          </div>

          {/* Pokemon Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredSpawns.map((spawn, i) => {
              const poke = getPokemonById(spawn.pokemon_id);
              if (!poke) return null;
              
              return (
                <div 
                  key={spawn.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="relative">
                    <PokemonCard pokemon={poke} />
                    <div className="absolute bottom-2 start-2">
                      <span className={cn(
                        'px-2 py-0.5 text-[10px] rounded-full bg-background/80 backdrop-blur-sm',
                        rarityColors[spawn.rarity as keyof typeof rarityColors]
                      )}>
                        {getRarityLabel(spawn.rarity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSpawns.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('لا توجد بوكيمونات بهذه الفلاتر', 'No Pokémon match these filters')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}