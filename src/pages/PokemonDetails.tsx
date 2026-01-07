import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, toggleFavorite, isFavorite, addRecent } from '@/lib/db';
import { useEffect, useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, ArrowRight, Star, Share2, ChevronRight,
  MapPin, Swords, Info, BarChart3, GitBranch, Shield, Zap, Sparkles, ClipboardCheck, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getReliableImageSources } from '@/lib/pokemon-images';
import { LivingDexProgress } from '@/components/LivingDexProgress';
import { CatchHelper } from '@/components/CatchHelper';
import { MoveAdvisor } from '@/components/MoveAdvisor';
import { 
  StatBar, 
  statLabels, 
  typeAverages, 
  TypeEffectivenessSection, 
  EvolutionChain, 
  MovesList, 
  LocationsList 
} from '@/components/pokemon-details';
import type { Pokemon, PokemonType } from '@/types/pokemon';

// Type gradient backgrounds
const typeGradients: Record<string, string> = {
  normal: 'from-[hsl(45,10%,50%)] to-[hsl(45,10%,30%)]',
  fire: 'from-[hsl(25,100%,55%)] to-[hsl(15,100%,40%)]',
  water: 'from-[hsl(210,100%,55%)] to-[hsl(220,100%,40%)]',
  electric: 'from-[hsl(50,100%,50%)] to-[hsl(45,100%,35%)]',
  grass: 'from-[hsl(120,60%,45%)] to-[hsl(130,60%,30%)]',
  ice: 'from-[hsl(185,80%,70%)] to-[hsl(190,80%,50%)]',
  fighting: 'from-[hsl(0,70%,45%)] to-[hsl(350,70%,30%)]',
  poison: 'from-[hsl(280,60%,50%)] to-[hsl(290,60%,35%)]',
  ground: 'from-[hsl(35,50%,45%)] to-[hsl(30,50%,30%)]',
  flying: 'from-[hsl(250,80%,70%)] to-[hsl(260,80%,50%)]',
  psychic: 'from-[hsl(330,80%,60%)] to-[hsl(340,80%,45%)]',
  bug: 'from-[hsl(75,60%,40%)] to-[hsl(80,60%,28%)]',
  rock: 'from-[hsl(45,40%,35%)] to-[hsl(40,40%,22%)]',
  ghost: 'from-[hsl(265,50%,45%)] to-[hsl(275,50%,30%)]',
  dragon: 'from-[hsl(260,90%,55%)] to-[hsl(270,90%,40%)]',
  dark: 'from-[hsl(260,20%,25%)] to-[hsl(250,20%,15%)]',
  steel: 'from-[hsl(220,20%,60%)] to-[hsl(225,20%,45%)]',
  fairy: 'from-[hsl(330,60%,70%)] to-[hsl(340,60%,55%)]',
};

const typeGlowColors: Record<string, string> = {
  normal: 'shadow-[0_0_60px_hsl(45,10%,50%,0.4)]',
  fire: 'shadow-[0_0_60px_hsl(25,100%,55%,0.5)]',
  water: 'shadow-[0_0_60px_hsl(210,100%,55%,0.5)]',
  electric: 'shadow-[0_0_60px_hsl(50,100%,50%,0.5)]',
  grass: 'shadow-[0_0_60px_hsl(120,60%,45%,0.5)]',
  ice: 'shadow-[0_0_60px_hsl(185,80%,70%,0.5)]',
  fighting: 'shadow-[0_0_60px_hsl(0,70%,45%,0.5)]',
  poison: 'shadow-[0_0_60px_hsl(280,60%,50%,0.5)]',
  ground: 'shadow-[0_0_60px_hsl(35,50%,45%,0.4)]',
  flying: 'shadow-[0_0_60px_hsl(250,80%,70%,0.5)]',
  psychic: 'shadow-[0_0_60px_hsl(330,80%,60%,0.5)]',
  bug: 'shadow-[0_0_60px_hsl(75,60%,40%,0.4)]',
  rock: 'shadow-[0_0_60px_hsl(45,40%,35%,0.4)]',
  ghost: 'shadow-[0_0_60px_hsl(265,50%,45%,0.5)]',
  dragon: 'shadow-[0_0_60px_hsl(260,90%,55%,0.5)]',
  dark: 'shadow-[0_0_60px_hsl(260,20%,25%,0.4)]',
  steel: 'shadow-[0_0_60px_hsl(220,20%,60%,0.4)]',
  fairy: 'shadow-[0_0_60px_hsl(330,60%,70%,0.5)]',
};

// Pokemon Image Component with fallbacks
function PokemonImageWithFallback({ 
  pokemon, 
  size = 'lg',
  className 
}: { 
  pokemon: Pokemon; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const imageSources = useMemo(() => {
    const sources = [
      pokemon.images.artwork,
      pokemon.images.animated,
      ...getReliableImageSources(pokemon.id, pokemon.dex_no),
    ].filter(Boolean) as string[];
    return [...new Set(sources)];
  }, [pokemon.id, pokemon.dex_no, pokemon.images.artwork, pokemon.images.animated]);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };
  
  const handleError = () => {
    if (currentIndex < imageSources.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };
  
  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-secondary/30 rounded-full',
        sizeClasses[size],
        className
      )}>
        <span className="text-4xl">❓</span>
      </div>
    );
  }
  
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {isLoading && (
        <div className={cn(
          'absolute inset-0 rounded-full bg-secondary/30 animate-pulse',
        )} />
      )}
      <img
        src={imageSources[currentIndex]}
        alt={pokemon.name_en}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        className={cn(
          'w-full h-full object-contain transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  );
}

export default function PokemonDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguage();
  const [animateFav, setAnimateFav] = useState(false);
  const [typePressed, setTypePressed] = useState<string | null>(null);
  const [catchHelperOpen, setCatchHelperOpen] = useState(false);

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
  const allMoves = useLiveQuery(() => db.moves.toArray(), []);
  const allPokemon = useLiveQuery(() => db.pokemon.toArray(), []);

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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: pokemon ? t(pokemon.name_ar, pokemon.name_en) : 'Pokémon',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary animate-pulse" />
          <div className="text-muted-foreground">{t('جاري التحميل...', 'Loading...')}</div>
        </div>
      </div>
    );
  }

  const isLegendary = pokemon.tags.includes('legendary') || pokemon.tags.includes('mythical');
  const isAlpha = pokemon.tags.includes('alpha');
  const isNoble = pokemon.tags.includes('noble');
  const bst = Object.values(pokemon.stats).reduce((a, b) => a + b, 0);
  const primaryType = pokemon.types[0];
  const typeAverage = typeAverages[primaryType] || 75;

  return (
    <div className="pb-24 min-h-screen">
      {/* Dynamic Type Background */}
      <div 
        className={cn(
          'fixed inset-0 opacity-20 pointer-events-none transition-opacity duration-500',
          `bg-gradient-to-br ${typeGradients[primaryType]}`
        )}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      {/* Hero Section */}
      <div className="relative pt-4 pb-8 px-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4 animate-fade-in-up">
          <Link to="/pokemon">
            <Button variant="ghost" size="icon" className="backdrop-blur-sm bg-secondary/50">
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCatchHelperOpen(true)} 
              className="backdrop-blur-sm bg-primary/20 hover:bg-primary/30 text-primary"
              title={t('مساعد الصيد', 'Catch Helper')}
            >
              <Target className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare} className="backdrop-blur-sm bg-secondary/50">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFavorite} className="backdrop-blur-sm bg-secondary/50">
              <Star className={cn(
                'w-5 h-5 transition-all',
                favorite ? 'fill-gold text-gold' : 'text-muted-foreground',
                animateFav && 'favorite-pulse'
              )} />
            </Button>
          </div>
        </div>

        {/* Adjacent Pokemon Navigation */}
        <div className="flex justify-between items-center mb-6 animate-fade-in-up animation-delay-100">
          {adjacentPokemon?.prev ? (
            <Link 
              to={`/pokemon/${adjacentPokemon.prev.id}`} 
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/50 backdrop-blur-sm text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <img src={adjacentPokemon.prev.images.thumb} alt="" className="w-6 h-6" />
              #{String(adjacentPokemon.prev.dex_no).padStart(3, '0')}
            </Link>
          ) : <div />}
          
          {adjacentPokemon?.next ? (
            <Link 
              to={`/pokemon/${adjacentPokemon.next.id}`} 
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/50 backdrop-blur-sm text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              #{String(adjacentPokemon.next.dex_no).padStart(3, '0')}
              <img src={adjacentPokemon.next.images.thumb} alt="" className="w-6 h-6" />
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          ) : <div />}
        </div>

        {/* Pokemon Image with Visual Frame */}
        <div className="animate-fade-in-up animation-delay-200">
          <div className={cn(
            'relative w-72 h-72 mx-auto mb-6',
            'rounded-full',
            typeGlowColors[primaryType],
            isLegendary && 'wax-seal',
            isAlpha && 'token-stack',
            !isLegendary && !isAlpha && 'bouquet-badge'
          )}>
            {/* Glow Ring */}
            <div 
              className="absolute inset-0 rounded-full animate-pulse opacity-50"
              style={{
                background: `radial-gradient(circle, hsl(var(--type-${primaryType}) / 0.3) 0%, transparent 70%)`
              }}
            />
            
            {/* Image Container with fallback */}
            <div className="relative w-full h-full flex items-center justify-center">
              <PokemonImageWithFallback 
                pokemon={pokemon} 
                size="xl" 
                className="drop-shadow-2xl animate-float"
              />
            </div>
            
            {/* Legendary Crown Effect */}
            {isLegendary && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                👑
              </div>
            )}
          </div>
        </div>

        {/* Dex Number */}
        <div className="text-center text-sm font-medium text-muted-foreground mb-2 animate-fade-in-up animation-delay-300">
          #{String(pokemon.dex_no).padStart(3, '0')}
        </div>

        {/* Name */}
        <h1 className="text-4xl font-black text-center mb-4 animate-fade-in-up animation-delay-300">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t(pokemon.name_ar, pokemon.name_en)}
          </span>
        </h1>

        {/* Types with Interaction */}
        <div className="flex justify-center gap-3 mb-4 animate-fade-in-up animation-delay-400">
          {pokemon.types.map(type => (
            <button 
              key={type}
              onMouseDown={() => setTypePressed(type)}
              onMouseUp={() => setTypePressed(null)}
              onMouseLeave={() => setTypePressed(null)}
              onTouchStart={() => setTypePressed(type)}
              onTouchEnd={() => setTypePressed(null)}
              className={cn(
                'px-5 py-2 text-sm font-bold rounded-full capitalize text-white transition-all duration-200',
                typePressed === type ? 'scale-95' : 'hover:scale-110'
              )}
              style={{ 
                backgroundColor: `hsl(var(--type-${type}))`,
                boxShadow: typePressed === type 
                  ? `0 0 30px hsl(var(--type-${type}) / 0.8)` 
                  : `0 4px 15px hsl(var(--type-${type}) / 0.4)`
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex justify-center flex-wrap gap-2 animate-fade-in-up animation-delay-500">
          {isLegendary && (
            <span className="px-4 py-1.5 text-xs font-black rounded-full bg-gradient-to-r from-gold/30 to-gold/10 text-gold border border-gold/50 shadow-[0_0_15px_hsl(45,100%,55%,0.3)]">
              ✨ {t('أسطوري', 'LEGENDARY')}
            </span>
          )}
          {isAlpha && (
            <span className="px-4 py-1.5 text-xs font-black rounded-full bg-gradient-to-r from-destructive/30 to-destructive/10 text-destructive border border-destructive/50 shadow-[0_0_15px_hsl(0,72%,51%,0.3)]">
              🔴 {t('ألفا', 'ALPHA')}
            </span>
          )}
          {isNoble && (
            <span className="px-4 py-1.5 text-xs font-black rounded-full bg-gradient-to-r from-accent/30 to-accent/10 text-accent border border-accent/50">
              💎 {t('نبيل', 'NOBLE')}
            </span>
          )}
          {pokemon.tags.includes('hisuian') && (
            <span className="px-4 py-1.5 text-xs font-black rounded-full bg-gradient-to-r from-primary/30 to-primary/10 text-primary border border-primary/50">
              🌸 {t('هيسوي', 'HISUIAN')}
            </span>
          )}
          {pokemon.tags.includes('starter') && (
            <span className="px-4 py-1.5 text-xs font-black rounded-full bg-gradient-to-r from-type-grass/30 to-type-grass/10 text-type-grass border border-type-grass/50">
              ⭐ {t('بداية', 'STARTER')}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="container px-4 relative z-10">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 bg-secondary/50 backdrop-blur-sm p-1 rounded-xl">
            <TabsTrigger value="overview" className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('عام', 'Info')}</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('تقدم', 'Track')}</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('إحصائيات', 'Stats')}</span>
            </TabsTrigger>
            <TabsTrigger value="moves" className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Swords className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('حركات', 'Moves')}</span>
            </TabsTrigger>
            <TabsTrigger value="evolution" className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <GitBranch className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('تطور', 'Evo')}</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('مواقع', 'Loc')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="p-5 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/50 animate-fade-in-up">
              <h3 className="font-bold mb-3 text-lg">{t('الوصف', 'Description')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(pokemon.description_ar, pokemon.description_en)}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 animate-fade-in-up animation-delay-100">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 text-center">
                <div className="text-3xl font-black text-primary">{bst}</div>
                <div className="text-xs text-muted-foreground">{t('إجمالي', 'BST')}</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
                <div className="text-3xl font-black">{pokemon.types.length}</div>
                <div className="text-xs text-muted-foreground">{t('أنواع', 'Types')}</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center">
                <div className="text-3xl font-black">{pokemon.learnset?.length || 0}</div>
                <div className="text-xs text-muted-foreground">{t('حركات', 'Moves')}</div>
              </div>
            </div>
            
            {/* Type Effectiveness */}
            <div className="animate-fade-in-up animation-delay-200">
              <h3 className="font-bold mb-3 text-lg">{t('فعالية الأنواع', 'Type Effectiveness')}</h3>
              <TypeEffectivenessSection types={pokemon.types} />
            </div>
          </TabsContent>

          {/* Progress Tab - Living Dex */}
          <TabsContent value="progress" className="space-y-4">
            <LivingDexProgress 
              pokemonId={pokemon.id} 
              pokemonName={t(pokemon.name_ar, pokemon.name_en)} 
            />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <div className="p-5 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/50 space-y-4">
              {(Object.entries(pokemon.stats) as [keyof typeof statLabels, number][]).map(([key, value], idx) => (
                <StatBar 
                  key={key}
                  label={t(statLabels[key].ar, statLabels[key].en)}
                  shortLabel={statLabels[key].short}
                  value={value}
                  color={statLabels[key].color}
                  average={Math.round(typeAverage * (key === 'hp' ? 1.2 : key === 'spe' ? 0.9 : 1))}
                  delay={idx * 100}
                />
              ))}
            </div>
            
            {/* BST Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 text-center animate-fade-in-up animation-delay-300">
                <div className="text-4xl font-black text-primary mb-1">{bst}</div>
                <div className="text-sm text-muted-foreground">{t('مجموع الإحصائيات', 'Base Stat Total')}</div>
              </div>
              <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50 text-center animate-fade-in-up animation-delay-400">
                <div className="text-4xl font-black text-muted-foreground mb-1">{typeAverage * 6}</div>
                <div className="text-sm text-muted-foreground">{t('متوسط النوع', 'Type Average')}</div>
              </div>
            </div>
            
            {/* Stat Rating */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 animate-fade-in-up animation-delay-500">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('التصنيف', 'Rating')}</span>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-bold',
                  bst >= 600 ? 'bg-gold/20 text-gold' :
                  bst >= 500 ? 'bg-primary/20 text-primary' :
                  bst >= 400 ? 'bg-type-grass/20 text-type-grass' :
                  'bg-secondary text-muted-foreground'
                )}>
                  {bst >= 600 ? t('أسطوري', 'Legendary') :
                   bst >= 500 ? t('ممتاز', 'Excellent') :
                   bst >= 400 ? t('جيد', 'Good') :
                   t('متوسط', 'Average')}
                </span>
              </div>
            </div>
          </TabsContent>

          {/* Moves Tab */}
          <TabsContent value="moves" className="space-y-4">
            <div className="flex justify-end">
              <MoveAdvisor pokemon={pokemon} moves={allMoves || []} />
            </div>
            <MovesList learnset={pokemon.learnset || []} moves={allMoves || []} />
          </TabsContent>

          {/* Evolution Tab */}
          <TabsContent value="evolution">
            <EvolutionChain 
              pokemon={pokemon} 
              evolutions={evolutionPokemon || []} 
              allPokemon={allPokemon || []}
            />
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations">
            <LocationsList spawns={spawns || []} locations={locations || []} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Catch Helper Modal */}
      {pokemon && (
        <CatchHelper
          pokemon={pokemon}
          spawns={spawns || []}
          isOpen={catchHelperOpen}
          onClose={() => setCatchHelperOpen(false)}
        />
      )}
      
      {/* Custom Styles */}
      <style>{`
        @keyframes grow-bar {
          from { width: 0; }
        }
      `}</style>
    </div>
  );
}
