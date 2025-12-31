import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, toggleFavorite, isFavorite, addRecent } from '@/lib/db';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, ArrowRight, Star, Share2, ChevronRight, 
  MapPin, Swords, Info, BarChart3, GitBranch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Pokemon, Spawn, Location } from '@/types/pokemon';

const typeColors: Record<string, string> = {
  normal: 'bg-type-normal', fire: 'bg-type-fire', water: 'bg-type-water',
  electric: 'bg-type-electric', grass: 'bg-type-grass', ice: 'bg-type-ice',
  fighting: 'bg-type-fighting', poison: 'bg-type-poison', ground: 'bg-type-ground',
  flying: 'bg-type-flying', psychic: 'bg-type-psychic', bug: 'bg-type-bug',
  rock: 'bg-type-rock', ghost: 'bg-type-ghost', dragon: 'bg-type-dragon',
  dark: 'bg-type-dark', steel: 'bg-type-steel', fairy: 'bg-type-fairy',
};

const statLabels = {
  hp: { ar: 'صحة', en: 'HP', color: 'bg-type-fighting' },
  atk: { ar: 'هجوم', en: 'Atk', color: 'bg-type-fire' },
  def: { ar: 'دفاع', en: 'Def', color: 'bg-type-electric' },
  spa: { ar: 'هـ.خاص', en: 'Sp.A', color: 'bg-type-water' },
  spd: { ar: 'د.خاص', en: 'Sp.D', color: 'bg-type-grass' },
  spe: { ar: 'سرعة', en: 'Spd', color: 'bg-type-psychic' },
};

function StatBar({ label, value, maxValue = 255, color }: { label: string; value: number; maxValue?: number; color: string }) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-sm text-muted-foreground">{label}</span>
      <span className="w-8 text-sm font-semibold text-foreground">{value}</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function EvolutionChain({ pokemon, evolutions }: { pokemon: Pokemon; evolutions: Pokemon[] }) {
  const { t } = useLanguage();
  
  if (pokemon.evolutions.length === 0 && evolutions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('لا يوجد تطور', 'No evolution')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pokemon.evolutions.map((evo, idx) => {
        const evolvedPokemon = evolutions.find(p => p.id === evo.to_id);
        
        return (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
            {/* Current Pokemon */}
            <div className="flex flex-col items-center">
              <img 
                src={pokemon.images.thumb} 
                alt={t(pokemon.name_ar, pokemon.name_en)}
                className="w-16 h-16 object-contain"
              />
              <span className="text-xs mt-1">{t(pokemon.name_ar, pokemon.name_en)}</span>
            </div>
            
            {/* Arrow & Condition */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <ChevronRight className="w-6 h-6 text-primary rtl:rotate-180" />
              <span className="text-xs text-muted-foreground text-center">
                {t(evo.conditions_ar, evo.conditions_en)}
              </span>
            </div>
            
            {/* Evolved Pokemon */}
            {evolvedPokemon ? (
              <Link to={`/pokemon/${evolvedPokemon.id}`} className="flex flex-col items-center hover:scale-105 transition-transform">
                <img 
                  src={evolvedPokemon.images.thumb} 
                  alt={t(evolvedPokemon.name_ar, evolvedPokemon.name_en)}
                  className="w-16 h-16 object-contain"
                />
                <span className="text-xs mt-1">{t(evolvedPokemon.name_ar, evolvedPokemon.name_en)}</span>
              </Link>
            ) : (
              <div className="flex flex-col items-center opacity-50">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-2xl">?</span>
                </div>
                <span className="text-xs mt-1">{evo.to_id}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LocationsList({ spawns, locations }: { spawns: Spawn[]; locations: Location[] }) {
  const { t } = useLanguage();
  
  if (spawns.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('لا توجد مواقع ظهور', 'No spawn locations')}
      </div>
    );
  }

  const rarityColors = {
    common: 'text-type-grass',
    uncommon: 'text-type-water',
    rare: 'text-type-psychic',
    very_rare: 'text-gold',
  };

  const rarityLabels = {
    common: { ar: 'شائع', en: 'Common' },
    uncommon: { ar: 'غير شائع', en: 'Uncommon' },
    rare: { ar: 'نادر', en: 'Rare' },
    very_rare: { ar: 'نادر جداً', en: 'Very Rare' },
  };

  return (
    <div className="space-y-3">
      {spawns.map(spawn => {
        const location = locations.find(l => l.id === spawn.location_id);
        
        return (
          <div 
            key={spawn.id} 
            className="p-4 rounded-xl bg-secondary/30 border border-border/50"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {location ? t(location.name_ar, location.name_en) : spawn.location_id}
                </span>
              </div>
              <span className={cn('text-xs font-medium', rarityColors[spawn.rarity])}>
                {t(rarityLabels[spawn.rarity].ar, rarityLabels[spawn.rarity].en)}
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground mb-1">
              📍 {t(spawn.area_ar, spawn.area_en)}
            </div>
            
            <div className="text-xs text-muted-foreground">
              🕐 {t(spawn.conditions_ar, spawn.conditions_en)}
            </div>
            
            {spawn.is_alpha && (
              <div className="mt-2 inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-destructive/20 text-destructive border border-destructive/30">
                {t('ألفا', 'ALPHA')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PokemonDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguage();
  const [animateFav, setAnimateFav] = useState(false);

  const pokemon = useLiveQuery(() => 
    id ? db.pokemon.get(id) : undefined
  , [id]);

  const favorite = useLiveQuery(() => 
    id ? isFavorite('pokemon', id) : false
  , [id]);

  const spawns = useLiveQuery(() => 
    id ? db.spawns.where('pokemon_id').equals(id).toArray() : []
  , [id]);

  const locations = useLiveQuery(() => db.locations.toArray(), []);

  const evolutionPokemon = useLiveQuery(async () => {
    if (!pokemon) return [];
    const ids = pokemon.evolutions.map(e => e.to_id);
    return db.pokemon.where('id').anyOf(ids).toArray();
  }, [pokemon]);

  const adjacentPokemon = useLiveQuery(async () => {
    if (!pokemon) return { prev: null, next: null };
    const prev = await db.pokemon.where('dex_no').equals(pokemon.dex_no - 1).first();
    const next = await db.pokemon.where('dex_no').equals(pokemon.dex_no + 1).first();
    return { prev, next };
  }, [pokemon]);

  useEffect(() => {
    if (id) addRecent('pokemon', id);
  }, [id]);

  const handleFavorite = async () => {
    if (!id) return;
    setAnimateFav(true);
    await toggleFavorite('pokemon', id);
    setTimeout(() => setAnimateFav(false), 400);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  const isLegendary = pokemon.tags.includes('legendary') || pokemon.tags.includes('mythical');
  const isAlpha = pokemon.tags.includes('alpha');
  const isNoble = pokemon.tags.includes('noble');
  const bst = Object.values(pokemon.stats).reduce((a, b) => a + b, 0);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className={cn(
        'relative pt-4 pb-8 px-4',
        'bg-gradient-to-b from-secondary/50 to-transparent'
      )}>
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/pokemon">
            <Button variant="ghost" size="icon">
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFavorite}>
              <Star className={cn(
                'w-5 h-5 transition-all',
                favorite ? 'fill-gold text-gold' : 'text-muted-foreground',
                animateFav && 'favorite-pulse'
              )} />
            </Button>
          </div>
        </div>

        {/* Adjacent Pokemon Navigation */}
        <div className="flex justify-between items-center mb-4">
          {adjacentPokemon?.prev ? (
            <Link to={`/pokemon/${adjacentPokemon.prev.id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              #{String(adjacentPokemon.prev.dex_no).padStart(3, '0')}
            </Link>
          ) : <div />}
          
          {adjacentPokemon?.next ? (
            <Link to={`/pokemon/${adjacentPokemon.next.id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              #{String(adjacentPokemon.next.dex_no).padStart(3, '0')}
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          ) : <div />}
        </div>

        {/* Pokemon Image */}
        <div className={cn(
          'relative w-48 h-48 mx-auto mb-4',
          isLegendary && 'wax-seal glow-gold',
          isAlpha && 'token-stack glow-alpha',
          isNoble && 'glow-magenta',
          !isLegendary && !isAlpha && !isNoble && 'bouquet-badge'
        )}>
          <img 
            src={pokemon.images.artwork}
            alt={t(pokemon.name_ar, pokemon.name_en)}
            className="w-full h-full object-contain drop-shadow-2xl animate-float"
          />
        </div>

        {/* Dex Number */}
        <div className="text-center text-sm text-muted-foreground mb-1">
          #{String(pokemon.dex_no).padStart(3, '0')}
        </div>

        {/* Name */}
        <h1 className="text-3xl font-bold text-center mb-3">
          {t(pokemon.name_ar, pokemon.name_en)}
        </h1>

        {/* Types */}
        <div className="flex justify-center gap-2 mb-3">
          {pokemon.types.map(type => (
            <span 
              key={type}
              className="px-4 py-1.5 text-sm font-medium rounded-full capitalize text-white"
              style={{ backgroundColor: `hsl(var(--type-${type}))` }}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Tags */}
        <div className="flex justify-center gap-2">
          {isLegendary && (
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-gold/20 text-gold border border-gold/30">
              {t('أسطوري', 'LEGENDARY')}
            </span>
          )}
          {isAlpha && (
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-destructive/20 text-destructive border border-destructive/30">
              {t('ألفا', 'ALPHA')}
            </span>
          )}
          {isNoble && (
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-accent/20 text-accent border border-accent/30">
              {t('نبيل', 'NOBLE')}
            </span>
          )}
          {pokemon.tags.includes('hisuian') && (
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/20 text-primary border border-primary/30">
              {t('هيسوي', 'HISUIAN')}
            </span>
          )}
          {pokemon.tags.includes('starter') && (
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-type-grass/20 text-type-grass border border-type-grass/30">
              {t('بداية', 'STARTER')}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="container px-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="gap-1 text-xs">
              <Info className="w-3 h-3" />
              {t('عام', 'Info')}
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-1 text-xs">
              <BarChart3 className="w-3 h-3" />
              {t('إحصائيات', 'Stats')}
            </TabsTrigger>
            <TabsTrigger value="evolution" className="gap-1 text-xs">
              <GitBranch className="w-3 h-3" />
              {t('تطور', 'Evo')}
            </TabsTrigger>
            <TabsTrigger value="locations" className="gap-1 text-xs">
              <MapPin className="w-3 h-3" />
              {t('مواقع', 'Loc')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <h3 className="font-semibold mb-2">{t('الوصف', 'Description')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(pokemon.description_ar, pokemon.description_en)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
                <div className="text-2xl font-bold text-primary">{bst}</div>
                <div className="text-xs text-muted-foreground">{t('مجموع الإحصائيات', 'Base Stat Total')}</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
                <div className="text-2xl font-bold text-accent">{pokemon.types.length}</div>
                <div className="text-xs text-muted-foreground">{t('أنواع', 'Types')}</div>
              </div>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-3">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
              {(Object.entries(pokemon.stats) as [keyof typeof statLabels, number][]).map(([key, value]) => (
                <StatBar 
                  key={key}
                  label={t(statLabels[key].ar, statLabels[key].en)}
                  value={value}
                  color={statLabels[key].color}
                />
              ))}
            </div>
            
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
              <div className="text-3xl font-bold text-primary">{bst}</div>
              <div className="text-sm text-muted-foreground">{t('مجموع الإحصائيات الأساسية', 'Base Stat Total')}</div>
            </div>
          </TabsContent>

          {/* Evolution Tab */}
          <TabsContent value="evolution">
            <EvolutionChain pokemon={pokemon} evolutions={evolutionPokemon || []} />
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations">
            <LocationsList spawns={spawns || []} locations={locations || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
