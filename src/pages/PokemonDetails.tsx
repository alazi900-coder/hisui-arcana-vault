import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, toggleFavorite, isFavorite, addRecent } from '@/lib/db';
import { useEffect, useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, ArrowRight, Star, Share2, ChevronRight, ChevronDown,
  MapPin, Swords, Info, BarChart3, GitBranch, Search, Shield, Zap, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWeaknesses, getResistances, getImmunities } from '@/lib/type-chart';
import { getReliableImageSources } from '@/lib/pokemon-images';
import type { Pokemon, Spawn, Location, Move, LearnsetEntry, PokemonType } from '@/types/pokemon';

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

const statLabels = {
  hp: { ar: 'صحة', en: 'HP', color: 'bg-type-fighting', short: 'HP' },
  atk: { ar: 'هجوم', en: 'Attack', color: 'bg-type-fire', short: 'ATK' },
  def: { ar: 'دفاع', en: 'Defense', color: 'bg-type-electric', short: 'DEF' },
  spa: { ar: 'هـ.خاص', en: 'Sp. Atk', color: 'bg-type-water', short: 'SpA' },
  spd: { ar: 'د.خاص', en: 'Sp. Def', color: 'bg-type-grass', short: 'SpD' },
  spe: { ar: 'سرعة', en: 'Speed', color: 'bg-type-psychic', short: 'SPE' },
};

// Average stats by type (simplified averages)
const typeAverages: Record<string, number> = {
  normal: 75, fire: 80, water: 78, electric: 77, grass: 75, ice: 76,
  fighting: 82, poison: 74, ground: 80, flying: 76, psychic: 78, bug: 70,
  rock: 82, ghost: 78, dragon: 88, dark: 78, steel: 85, fairy: 76,
};

function StatBar({ 
  label, 
  shortLabel,
  value, 
  maxValue = 255, 
  color,
  average,
  delay = 0
}: { 
  label: string; 
  shortLabel: string;
  value: number; 
  maxValue?: number; 
  color: string;
  average?: number;
  delay?: number;
}) {
  const percentage = (value / maxValue) * 100;
  const avgPercentage = average ? (average / maxValue) * 100 : 0;
  
  const getStatRating = (val: number) => {
    if (val >= 150) return 'legendary';
    if (val >= 100) return 'excellent';
    if (val >= 80) return 'good';
    if (val >= 50) return 'average';
    return 'low';
  };
  
  const rating = getStatRating(value);
  const ratingColors = {
    legendary: 'text-gold',
    excellent: 'text-primary',
    good: 'text-type-grass',
    average: 'text-muted-foreground',
    low: 'text-destructive',
  };
  
  return (
    <div 
      className="flex items-center gap-3 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="w-12 text-xs font-medium text-muted-foreground uppercase">{shortLabel}</span>
      <span className={cn('w-10 text-sm font-bold', ratingColors[rating])}>{value}</span>
      <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden relative">
        {average && (
          <div 
            className="absolute top-0 h-full w-0.5 bg-white/30 z-10"
            style={{ left: `${avgPercentage}%` }}
            title={`Avg: ${average}`}
          />
        )}
        <div 
          className={cn('h-full rounded-full transition-all duration-700 ease-out', color)}
          style={{ 
            width: `${percentage}%`,
            animation: `grow-bar 0.8s ease-out ${delay}ms both`
          }}
        />
      </div>
    </div>
  );
}

function TypeEffectivenessSection({ types }: { types: PokemonType[] }) {
  const { t } = useLanguage();
  
  const weaknesses = getWeaknesses(types);
  const resistances = getResistances(types);
  const immunities = getImmunities(types);
  
  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
          <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {t('نقاط الضعف', 'Weaknesses')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map(({ type, multiplier }) => (
              <span 
                key={type}
                className="px-3 py-1.5 text-xs font-bold rounded-full text-white capitalize flex items-center gap-1 transition-transform hover:scale-110"
                style={{ backgroundColor: `hsl(var(--type-${type}))` }}
              >
                {type}
                <span className="text-white/80">×{multiplier}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Resistances */}
      {resistances.length > 0 && (
        <div className="p-4 rounded-xl bg-type-grass/10 border border-type-grass/30">
          <h4 className="font-semibold text-type-grass mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {t('المقاومة', 'Resistances')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {resistances.map(({ type, multiplier }) => (
              <span 
                key={type}
                className="px-3 py-1.5 text-xs font-bold rounded-full text-white capitalize flex items-center gap-1 transition-transform hover:scale-110"
                style={{ backgroundColor: `hsl(var(--type-${type}))` }}
              >
                {type}
                <span className="text-white/80">×{multiplier}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Immunities */}
      {immunities.length > 0 && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
          <h4 className="font-semibold text-primary mb-3">{t('المناعة', 'Immunities')}</h4>
          <div className="flex flex-wrap gap-2">
            {immunities.map(type => (
              <span 
                key={type}
                className="px-3 py-1.5 text-xs font-bold rounded-full text-white capitalize transition-transform hover:scale-110"
                style={{ backgroundColor: `hsl(var(--type-${type}))` }}
              >
                {type} ×0
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
    // Remove duplicates
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

// Evolution condition icons
const evolutionIcons: Record<string, string> = {
  level: '📈',
  stone: '💎',
  trade: '🔄',
  friendship: '💖',
  item: '🎁',
  time: '🌙',
  location: '📍',
  move: '⚔️',
  default: '✨',
};

function getEvolutionIcon(condition: string): string {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('level') || lowerCondition.includes('مستوى')) return evolutionIcons.level;
  if (lowerCondition.includes('stone') || lowerCondition.includes('حجر')) return evolutionIcons.stone;
  if (lowerCondition.includes('trade') || lowerCondition.includes('تبادل')) return evolutionIcons.trade;
  if (lowerCondition.includes('friend') || lowerCondition.includes('صداقة')) return evolutionIcons.friendship;
  if (lowerCondition.includes('night') || lowerCondition.includes('day') || lowerCondition.includes('ليل') || lowerCondition.includes('نهار')) return evolutionIcons.time;
  if (lowerCondition.includes('location') || lowerCondition.includes('مكان')) return evolutionIcons.location;
  if (lowerCondition.includes('move') || lowerCondition.includes('حركة')) return evolutionIcons.move;
  return evolutionIcons.default;
}

function EvolutionChain({ pokemon, evolutions, allPokemon }: { pokemon: Pokemon; evolutions: Pokemon[]; allPokemon: Pokemon[] }) {
  const { t } = useLanguage();
  
  // Find pre-evolution
  const preEvolution = allPokemon.find(p => 
    p.evolutions.some(e => e.to_id === pokemon.id)
  );
  
  // Get pre-evolution condition
  const preEvoCondition = preEvolution?.evolutions.find(e => e.to_id === pokemon.id);
  
  if (pokemon.evolutions.length === 0 && !preEvolution) {
    return (
      <div className="text-center py-12 text-muted-foreground animate-fade-in-up">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary/30 flex items-center justify-center">
          <GitBranch className="w-10 h-10 text-muted-foreground/30" />
        </div>
        <p className="text-lg">{t('هذا البوكيمون لا يتطور', 'This Pokémon does not evolve')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Evolution Timeline */}
      <div className="relative">
        {/* Timeline connector */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary to-primary/50 -translate-x-1/2 hidden md:block" />
        
        <div className="space-y-8">
          {/* Pre-evolution */}
          {preEvolution && (
            <div className="animate-fade-in-up">
              <div className="flex flex-col items-center">
                <Link 
                  to={`/pokemon/${preEvolution.id}`}
                  className="group relative flex flex-col items-center p-6 rounded-2xl bg-secondary/20 border border-border/30 hover:bg-secondary/40 hover:border-primary/30 transition-all hover:scale-105 w-full max-w-xs mx-auto"
                >
                  {/* Stage label */}
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                    {t('المرحلة السابقة', 'Previous Stage')}
                  </span>
                  
                  <PokemonImageWithFallback pokemon={preEvolution} size="md" className="mb-3" />
                  
                  <span className="text-xs text-muted-foreground">
                    #{String(preEvolution.dex_no).padStart(3, '0')}
                  </span>
                  <span className="font-semibold text-lg">
                    {t(preEvolution.name_ar, preEvolution.name_en)}
                  </span>
                  
                  {/* Types */}
                  <div className="flex gap-1 mt-2">
                    {preEvolution.types.map(type => (
                      <span 
                        key={type}
                        className="px-2 py-0.5 text-[10px] font-bold rounded-full capitalize text-white"
                        style={{ backgroundColor: `hsl(var(--type-${type}))` }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </Link>
                
                {/* Evolution arrow with condition */}
                <div className="flex flex-col items-center my-4 animate-fade-in-up animation-delay-100">
                  <div className="p-2 rounded-full bg-primary/10 border border-primary/30 mb-2">
                    <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
                  </div>
                  {preEvoCondition && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm">
                      <span>{getEvolutionIcon(preEvoCondition.conditions_en)}</span>
                      <span>{t(preEvoCondition.conditions_ar, preEvoCondition.conditions_en)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Current Pokemon */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="flex flex-col items-center">
              <div className="group relative flex flex-col items-center p-8 rounded-2xl bg-primary/10 border-2 border-primary/50 w-full max-w-sm mx-auto shadow-lg shadow-primary/20">
                {/* Current label */}
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {t('الحالي', 'Current')}
                </span>
                
                <PokemonImageWithFallback pokemon={pokemon} size="lg" className="mb-4" />
                
                <span className="text-sm text-primary font-medium">
                  #{String(pokemon.dex_no).padStart(3, '0')}
                </span>
                <span className="font-bold text-2xl text-primary">
                  {t(pokemon.name_ar, pokemon.name_en)}
                </span>
                
                {/* Types */}
                <div className="flex gap-2 mt-3">
                  {pokemon.types.map(type => (
                    <span 
                      key={type}
                      className="px-3 py-1 text-xs font-bold rounded-full capitalize text-white"
                      style={{ backgroundColor: `hsl(var(--type-${type}))` }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                
                {/* Stats summary */}
                <div className="mt-4 text-sm text-muted-foreground">
                  BST: <span className="font-bold text-foreground">{Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Evolutions */}
          {pokemon.evolutions.length > 0 && (
            <div className="animate-fade-in-up animation-delay-300">
              {/* Arrow */}
              <div className="flex flex-col items-center mb-4">
                <div className="p-2 rounded-full bg-primary/10 border border-primary/30">
                  <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
                </div>
              </div>
              
              {/* Evolution options */}
              <div className={cn(
                'grid gap-4',
                pokemon.evolutions.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : 
                pokemon.evolutions.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto'
              )}>
                {pokemon.evolutions.map((evo, idx) => {
                  const evolvedPokemon = evolutions.find(p => p.id === evo.to_id);
                  
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Condition badge */}
                      <div className="flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm">
                        <span>{getEvolutionIcon(evo.conditions_en)}</span>
                        <span>{t(evo.conditions_ar, evo.conditions_en)}</span>
                      </div>
                      
                      {evolvedPokemon ? (
                        <Link 
                          to={`/pokemon/${evolvedPokemon.id}`}
                          className="group relative flex flex-col items-center p-6 rounded-2xl bg-secondary/20 border border-border/30 hover:bg-secondary/40 hover:border-primary/30 transition-all hover:scale-105 w-full"
                        >
                          {/* Stage label */}
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                            {t('المرحلة التالية', 'Next Stage')}
                          </span>
                          
                          <PokemonImageWithFallback pokemon={evolvedPokemon} size="md" className="mb-3" />
                          
                          <span className="text-xs text-muted-foreground">
                            #{String(evolvedPokemon.dex_no).padStart(3, '0')}
                          </span>
                          <span className="font-semibold text-lg">
                            {t(evolvedPokemon.name_ar, evolvedPokemon.name_en)}
                          </span>
                          
                          {/* Types */}
                          <div className="flex gap-1 mt-2">
                            {evolvedPokemon.types.map(type => (
                              <span 
                                key={type}
                                className="px-2 py-0.5 text-[10px] font-bold rounded-full capitalize text-white"
                                style={{ backgroundColor: `hsl(var(--type-${type}))` }}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                          
                          {/* Stat change indicator */}
                          <div className="mt-3 text-xs text-muted-foreground">
                            BST: <span className="font-medium">{Object.values(evolvedPokemon.stats).reduce((a, b) => a + b, 0)}</span>
                            <span className="text-type-grass ms-1">
                              (+{Object.values(evolvedPokemon.stats).reduce((a, b) => a + b, 0) - Object.values(pokemon.stats).reduce((a, b) => a + b, 0)})
                            </span>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-secondary/10 border border-border/30 opacity-60 w-full">
                          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                            <span className="text-3xl">❓</span>
                          </div>
                          <span className="font-medium">{evo.to_id}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MovesList({ learnset, moves }: { learnset: LearnsetEntry[]; moves: Move[] }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  
  const methodLabels = {
    level: { ar: 'مستوى', en: 'Level' },
    tutor: { ar: 'معلم', en: 'Tutor' },
    evolution: { ar: 'تطور', en: 'Evolution' },
  };

  const categoryIcons = {
    physical: '⚔️',
    special: '✨',
    status: '🔮',
  };

  const filteredAndSortedMoves = useMemo(() => {
    let filtered = [...learnset];
    
    // Filter by method
    if (filterMethod !== 'all') {
      filtered = filtered.filter(entry => entry.method === filterMethod);
    }
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(entry => {
        const move = moves.find(m => m.id === entry.move_id);
        if (!move) return false;
        return move.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
               move.name_ar.includes(searchQuery) ||
               move.type.includes(searchQuery.toLowerCase());
      });
    }
    
    // Sort
    return filtered.sort((a, b) => {
      if (a.method === 'level' && b.method === 'level') {
        return (a.level || 0) - (b.level || 0);
      }
      if (a.method === 'level') return -1;
      if (b.method === 'level') return 1;
      if (a.method === 'tutor') return -1;
      if (b.method === 'tutor') return 1;
      return 0;
    });
  }, [learnset, moves, searchQuery, filterMethod]);
  
  if (learnset.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
          <Swords className="w-8 h-8 text-muted-foreground/50" />
        </div>
        {t('لا توجد حركات متاحة', 'No moves available')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex gap-2 animate-fade-in-up">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('بحث عن حركة...', 'Search moves...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-9 bg-secondary/50"
          />
        </div>
      </div>
      
      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in-up animation-delay-100">
        {['all', 'level', 'tutor', 'evolution'].map(method => (
          <button
            key={method}
            onClick={() => setFilterMethod(method)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all',
              filterMethod === method 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            )}
          >
            {method === 'all' ? t('الكل', 'All') : t(methodLabels[method as keyof typeof methodLabels].ar, methodLabels[method as keyof typeof methodLabels].en)}
          </button>
        ))}
      </div>
      
      {/* Moves Count */}
      <div className="text-xs text-muted-foreground">
        {t(`عرض ${filteredAndSortedMoves.length} من ${learnset.length} حركة`, `Showing ${filteredAndSortedMoves.length} of ${learnset.length} moves`)}
      </div>
      
      {/* Moves List - Enhanced Design */}
      <div className="space-y-3">
        {filteredAndSortedMoves.map((entry, idx) => {
          const move = moves.find(m => m.id === entry.move_id);
          if (!move) return null;
          
          const typeColor = `hsl(var(--type-${move.type}))`;
          
          return (
            <Link
              key={`${entry.move_id}-${idx}`}
              to={`/moves/${move.id}`}
              className="block group"
            >
              <div 
                className="relative p-4 rounded-2xl border border-border/30 bg-gradient-to-r from-secondary/40 to-secondary/20 hover:from-secondary/60 hover:to-secondary/40 transition-all duration-300 hover:scale-[1.02] animate-fade-in overflow-hidden"
                style={{ 
                  animationDelay: `${Math.min(idx * 50, 300)}ms`,
                  boxShadow: `inset 0 0 30px ${typeColor}15`
                }}
              >
                {/* Type glow accent */}
                <div 
                  className="absolute top-0 start-0 w-1.5 h-full rounded-s-2xl"
                  style={{ backgroundColor: typeColor }}
                />
                
                <div className="flex items-center justify-between ps-3">
                  {/* Left side - Move info */}
                  <div className="flex items-center gap-4">
                    {/* Type badge with glow */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase shadow-lg transition-transform group-hover:scale-110"
                      style={{ 
                        backgroundColor: typeColor,
                        boxShadow: `0 4px 20px ${typeColor}50`
                      }}
                    >
                      {move.type.slice(0, 3)}
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {t(move.name_ar, move.name_en)}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        {/* Learning method badge */}
                        <span 
                          className={cn(
                            "px-2.5 py-1 text-xs font-semibold rounded-full",
                            entry.method === 'level' && "bg-primary/20 text-primary",
                            entry.method === 'tutor' && "bg-type-psychic/20 text-type-psychic",
                            entry.method === 'evolution' && "bg-gold/20 text-gold"
                          )}
                        >
                          {entry.method === 'level' && entry.level 
                            ? `${t('مستوى', 'Lv.')} ${entry.level}`
                            : t(methodLabels[entry.method].ar, methodLabels[entry.method].en)
                          }
                        </span>
                        
                        {/* Category icon */}
                        <span className="text-lg">{categoryIcons[move.category]}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Stats */}
                  <div className="flex items-center gap-4">
                    {move.power && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">{t('قوة', 'PWR')}</div>
                        <div className="text-xl font-bold text-type-fire">{move.power}</div>
                      </div>
                    )}
                    {move.accuracy && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">{t('دقة', 'ACC')}</div>
                        <div className="text-xl font-bold text-type-water">{move.accuracy}%</div>
                      </div>
                    )}
                    {move.pp && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">PP</div>
                        <div className="text-xl font-bold text-primary">{move.pp}</div>
                      </div>
                    )}
                    
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {filteredAndSortedMoves.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {t('لا توجد حركات مطابقة', 'No matching moves')}
        </div>
      )}
    </div>
  );
}

function LocationsList({ spawns, locations }: { spawns: Spawn[]; locations: Location[] }) {
  const { t } = useLanguage();
  
  if (spawns.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-muted-foreground/50" />
        </div>
        {t('لا توجد مواقع ظهور معروفة', 'No known spawn locations')}
      </div>
    );
  }

  const rarityConfig = {
    common: { 
      color: 'text-type-grass', 
      bg: 'bg-type-grass/10 border-type-grass/30',
      label: { ar: 'شائع', en: 'Common' },
      icon: '🟢'
    },
    uncommon: { 
      color: 'text-type-water', 
      bg: 'bg-type-water/10 border-type-water/30',
      label: { ar: 'غير شائع', en: 'Uncommon' },
      icon: '🔵'
    },
    rare: { 
      color: 'text-type-psychic', 
      bg: 'bg-type-psychic/10 border-type-psychic/30',
      label: { ar: 'نادر', en: 'Rare' },
      icon: '🟣'
    },
    very_rare: { 
      color: 'text-gold', 
      bg: 'bg-gold/10 border-gold/30',
      label: { ar: 'نادر جداً', en: 'Very Rare' },
      icon: '⭐'
    },
  };

  return (
    <div className="space-y-3">
      {spawns.map((spawn, idx) => {
        const location = locations.find(l => l.id === spawn.location_id);
        const rarity = rarityConfig[spawn.rarity];
        
        return (
          <div 
            key={spawn.id} 
            className={cn(
              'p-4 rounded-xl border transition-all hover:scale-[1.01] animate-fade-in-up',
              spawn.is_alpha ? 'bg-destructive/10 border-destructive/30' : 'bg-secondary/30 border-border/50'
            )}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {spawn.is_alpha && (
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-destructive/30">
                <span className="px-3 py-1 text-xs font-black rounded-full bg-destructive text-white animate-pulse">
                  {t('ألفا', 'ALPHA')}
                </span>
                <span className="text-xs text-destructive">
                  {t('بوكيمون ألفا عملاق!', 'Giant Alpha Pokémon!')}
                </span>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="font-semibold block">
                    {location ? t(location.name_ar, location.name_en) : spawn.location_id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    📍 {t(spawn.area_ar, spawn.area_en)}
                  </span>
                </div>
              </div>
              <span className={cn('px-2 py-1 text-xs font-bold rounded-full border', rarity.bg, rarity.color)}>
                {rarity.icon} {t(rarity.label.ar, rarity.label.en)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
              <span>🕐</span>
              <span>{t(spawn.conditions_ar, spawn.conditions_en)}</span>
            </div>
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
  const [typePressed, setTypePressed] = useState<string | null>(null);

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
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-secondary/50 backdrop-blur-sm p-1 rounded-xl">
            <TabsTrigger value="overview" className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('عام', 'Info')}</span>
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
          <TabsContent value="moves">
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
      
      {/* Custom Styles */}
      <style>{`
        @keyframes grow-bar {
          from { width: 0; }
        }
      `}</style>
    </div>
  );
}
