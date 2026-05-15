import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { Location, Spawn, Pokemon } from '@/types/pokemon';
import { PokemonImage } from './PokemonImage';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useLivingDexMap } from '@/hooks/use-living-dex';
import {
  MapPin,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  Filter,
  X,
  Maximize2,
  Minimize2,
  Search,
  Target,
  TrendingUp,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type RegionConfig = {
  color: string;
  fill: string;
  fillSelected: string;
  stroke: string;
  icon: string;
  svgPath: string;
  labelPos: { x: number; y: number };
};

// Stylized Hisui geographic layout — viewBox 0 0 300 360.
// North (top) → Alabaster, Center → Coronet, West → Cobalt, East → Crimson, South → Obsidian.
const REGION_CONFIG: Record<string, RegionConfig> = {
  'alabaster-icelands': {
    color: 'hsl(200, 30%, 75%)',
    fill: 'hsl(200, 60%, 80%)',
    fillSelected: 'hsl(200, 80%, 88%)',
    stroke: 'hsl(200, 50%, 95%)',
    icon: '❄️',
    svgPath: 'M 60 20 L 240 20 L 270 50 L 278 105 L 250 125 L 215 120 L 180 125 L 150 122 L 120 125 L 85 120 L 50 125 L 22 105 L 30 50 Z',
    labelPos: { x: 150, y: 72 },
  },
  'coronet-highlands': {
    color: 'hsl(260, 40%, 55%)',
    fill: 'hsl(265, 45%, 50%)',
    fillSelected: 'hsl(265, 70%, 62%)',
    stroke: 'hsl(265, 60%, 75%)',
    icon: '⛰️',
    svgPath: 'M 120 125 L 150 122 L 180 125 L 198 170 L 195 220 L 175 248 L 150 256 L 125 248 L 105 220 L 102 170 Z',
    labelPos: { x: 150, y: 195 },
  },
  'cobalt-coastlands': {
    color: 'hsl(200, 80%, 50%)',
    fill: 'hsl(205, 75%, 45%)',
    fillSelected: 'hsl(205, 85%, 58%)',
    stroke: 'hsl(205, 80%, 70%)',
    icon: '🌊',
    svgPath: 'M 22 105 L 50 125 L 85 120 L 102 170 L 105 220 L 92 262 L 60 278 L 30 268 L 10 228 L 6 168 Z',
    labelPos: { x: 55, y: 195 },
  },
  'crimson-mirelands': {
    color: 'hsl(15, 70%, 50%)',
    fill: 'hsl(15, 65%, 48%)',
    fillSelected: 'hsl(15, 80%, 60%)',
    stroke: 'hsl(15, 75%, 72%)',
    icon: '🏜️',
    svgPath: 'M 278 105 L 250 125 L 215 120 L 198 170 L 195 220 L 208 262 L 240 278 L 270 268 L 290 228 L 294 168 Z',
    labelPos: { x: 245, y: 195 },
  },
  'obsidian-fieldlands': {
    color: 'hsl(120, 50%, 38%)',
    fill: 'hsl(135, 45%, 38%)',
    fillSelected: 'hsl(135, 60%, 48%)',
    stroke: 'hsl(135, 50%, 65%)',
    icon: '🌲',
    svgPath: 'M 30 268 L 60 278 L 92 262 L 125 248 L 150 256 L 175 248 L 208 262 L 240 278 L 270 268 L 268 318 L 200 342 L 100 342 L 32 318 Z',
    labelPos: { x: 150, y: 305 },
  },
};

const REGION_DRAW_ORDER: readonly string[] = [
  'alabaster-icelands',
  'crimson-mirelands',
  'cobalt-coastlands',
  'obsidian-fieldlands',
  'coronet-highlands',
];

// Rarity colors
const RARITY_CONFIG = {
  common: { color: 'bg-muted', label_ar: 'شائع', label_en: 'Common' },
  uncommon: { color: 'bg-green-600', label_ar: 'غير شائع', label_en: 'Uncommon' },
  rare: { color: 'bg-blue-600', label_ar: 'نادر', label_en: 'Rare' },
  very_rare: { color: 'bg-purple-600', label_ar: 'نادر جداً', label_en: 'Very Rare' },
};

interface HisuiMapProps {
  className?: string;
}

export function HisuiMap({ className }: HisuiMapProps) {
  const { t, isRTL } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    rarity?: string;
    alpha?: boolean;
    timeOfDay?: 'day' | 'night';
  }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Fetch data
  const locations = useLiveQuery(() => db.locations.toArray(), []);
  const spawns = useLiveQuery(() => db.spawns.toArray(), []);
  const pokemon = useLiveQuery(() => db.pokemon.toArray(), []);
  const livingDexMap = useLivingDexMap();

  // Create pokemon lookup
  const pokemonMap = useMemo(() => {
    if (!pokemon) return new Map<string, Pokemon>();
    return new Map(pokemon.map(p => [p.id, p]));
  }, [pokemon]);

  // Get spawns for selected region with filters
  const regionSpawns = useMemo(() => {
    if (!selectedRegion || !spawns) return [];
    
    let filtered = spawns.filter(s => s.location_id === selectedRegion);
    
    if (filter.rarity) {
      filtered = filtered.filter(s => s.rarity === filter.rarity);
    }
    if (filter.alpha !== undefined) {
      filtered = filtered.filter(s => s.is_alpha === filter.alpha);
    }
    if (filter.timeOfDay === 'day') {
      filtered = filtered.filter(s => 
        s.conditions_en.toLowerCase().includes('day') ||
        s.conditions_en.toLowerCase() === 'always'
      );
    }
    if (filter.timeOfDay === 'night') {
      filtered = filtered.filter(s => 
        s.conditions_en.toLowerCase().includes('night') ||
        s.conditions_en.toLowerCase() === 'always'
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => {
        const poke = pokemonMap.get(s.pokemon_id);
        if (!poke) return false;
        return poke.name_en.toLowerCase().includes(query) || 
               poke.name_ar.includes(query) ||
               poke.dex_no.toString().includes(query);
      });
    }

    // Remove duplicates by pokemon_id
    const seen = new Set<string>();
    return filtered.filter(s => {
      if (seen.has(s.pokemon_id)) return false;
      seen.add(s.pokemon_id);
      return true;
    });
  }, [selectedRegion, spawns, filter, searchQuery, pokemonMap]);

  // Get spawn counts and progress per region
  const regionStats = useMemo(() => {
    if (!spawns || !livingDexMap) return {} as Record<string, { total: number; caught: number; alpha: number }>;
    
    const stats: Record<string, { total: number; caught: number; alpha: number }> = {};
    const seenPokemon: Record<string, Set<string>> = {};
    
    spawns.forEach(s => {
      if (!stats[s.location_id]) {
        stats[s.location_id] = { total: 0, caught: 0, alpha: 0 };
        seenPokemon[s.location_id] = new Set();
      }
      
      // Count unique pokemon per region
      if (!seenPokemon[s.location_id].has(s.pokemon_id)) {
        seenPokemon[s.location_id].add(s.pokemon_id);
        stats[s.location_id].total++;
        
        const entry = livingDexMap.get(s.pokemon_id);
        if (entry?.caught) {
          stats[s.location_id].caught++;
        }
        if (entry?.alpha) {
          stats[s.location_id].alpha++;
        }
      }
    });
    
    return stats;
  }, [spawns, livingDexMap]);

  // Search results across all regions
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !spawns || !pokemon) return [];
    
    const query = searchQuery.toLowerCase();
    const results: Array<{ spawn: Spawn; pokemon: Pokemon; location: Location }> = [];
    
    spawns.forEach(s => {
      const poke = pokemonMap.get(s.pokemon_id);
      const loc = locations?.find(l => l.id === s.location_id);
      if (!poke || !loc) return;
      
      if (poke.name_en.toLowerCase().includes(query) || 
          poke.name_ar.includes(query) ||
          poke.dex_no.toString().includes(query)) {
        // Avoid duplicates
        if (!results.find(r => r.pokemon.id === poke.id && r.location.id === loc.id)) {
          results.push({ spawn: s, pokemon: poke, location: loc });
        }
      }
    });
    
    return results.slice(0, 12);
  }, [searchQuery, spawns, pokemon, pokemonMap, locations]);

  // Get selected location details
  const selectedLocation = locations?.find(l => l.id === selectedRegion);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    if (!pokemon || !livingDexMap) return { total: 0, caught: 0, percentage: 0 };
    
    const total = pokemon.length;
    const caught = Array.from(livingDexMap.values()).filter(e => e.caught).length;
    
    return {
      total,
      caught,
      percentage: total > 0 ? Math.round((caught / total) * 100) : 0,
    };
  }, [pokemon, livingDexMap]);

  return (
    <div className={cn(
      "relative transition-all duration-300",
      isFullscreen && "fixed inset-0 z-50 bg-background p-4",
      className
    )}>
      {/* Quick Stats Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 p-3 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{overallStats.caught}/{overallStats.total}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm">{overallStats.percentage}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={cn(
              "p-2 rounded-lg transition-all",
              showSearch ? "bg-primary text-primary-foreground" : "bg-secondary/80 hover:bg-secondary"
            )}
          >
            <Search className="w-4 h-4" />
          </button>
          
          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="mb-4 animate-fade-in-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ابحث عن بوكيمون...', 'Search Pokémon...')}
              className="pl-10 bg-secondary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 p-3 rounded-xl bg-secondary/50 border border-border/50">
              <h4 className="text-xs text-muted-foreground mb-2">
                {t('نتائج البحث', 'Search Results')} ({searchResults.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {searchResults.map(({ spawn, pokemon: poke, location }) => (
                  <button
                    key={`${spawn.id}-${location.id}`}
                    onClick={() => {
                      setSelectedRegion(location.id);
                      setShowSearch(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background transition-colors text-left"
                  >
                    <PokemonImage
                      pokemonId={poke.id}
                      dexNo={poke.dex_no}
                      name={isRTL ? poke.name_ar : poke.name_en}
                      currentImages={poke.images}
                      size="sm"
                      className="w-8 h-8"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {isRTL ? poke.name_ar : poke.name_en}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {REGION_CONFIG[location.id]?.icon}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Hisui SVG map */}
      <div className={cn(
        "relative w-full bg-gradient-to-b from-background via-card/30 to-background rounded-2xl overflow-hidden border border-border/50",
        isFullscreen && "flex-1"
      )}>
        <div className="absolute top-3 left-3 text-xs text-muted-foreground flex items-center gap-1.5 z-10 pointer-events-none">
          <MapPin className="w-3.5 h-3.5" />
          {t('منطقة هيسوي', 'Hisui Region')}
        </div>

        <svg
          viewBox="0 0 300 360"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={t('خريطة منطقة هيسوي', 'Map of the Hisui Region')}
          className="w-full h-auto max-h-[70vh] block"
        >
          <defs>
            <radialGradient id="hisuiOcean" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="hsl(210, 40%, 12%)" />
              <stop offset="100%" stopColor="hsl(220, 50%, 6%)" />
            </radialGradient>
            <filter id="regionGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ocean / background */}
          <rect x="0" y="0" width="300" height="360" fill="url(#hisuiOcean)" />

          {/* Region polygons */}
          {REGION_DRAW_ORDER.map((id) => {
            const config = REGION_CONFIG[id];
            const location = locations?.find((l) => l.id === id);
            if (!config || !location) return null;

            const isSelected = selectedRegion === id;
            const stats = regionStats[id] || { total: 0, caught: 0, alpha: 0 };
            const progress = stats.total > 0 ? Math.round((stats.caught / stats.total) * 100) : 0;
            const name = isRTL ? location.name_ar : location.name_en;

            return (
              <g
                key={id}
                role="button"
                tabIndex={0}
                aria-label={`${name} — ${stats.caught}/${stats.total} (${progress}%)`}
                aria-pressed={isSelected}
                onClick={() => setSelectedRegion(isSelected ? null : id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedRegion(isSelected ? null : id);
                  }
                }}
                className="cursor-pointer focus:outline-none"
                filter={isSelected ? 'url(#regionGlow)' : undefined}
              >
                <path
                  d={config.svgPath}
                  fill={isSelected ? config.fillSelected : config.fill}
                  stroke={isSelected ? 'hsl(185, 100%, 60%)' : config.stroke}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  strokeLinejoin="round"
                  className="transition-all duration-200 hover:brightness-110"
                  style={{ opacity: isSelected ? 1 : 0.92 }}
                />
                <text
                  x={config.labelPos.x}
                  y={config.labelPos.y - 8}
                  textAnchor="middle"
                  className="select-none pointer-events-none"
                  fill="white"
                  fontSize="18"
                  style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.55)', strokeWidth: 3, strokeLinejoin: 'round' }}
                >
                  {config.icon}
                </text>
                <text
                  x={config.labelPos.x}
                  y={config.labelPos.y + 12}
                  textAnchor="middle"
                  className="select-none pointer-events-none"
                  fill="white"
                  fontSize="10"
                  fontWeight="700"
                  style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.75)', strokeWidth: 3, strokeLinejoin: 'round' }}
                >
                  {name}
                </text>
                <text
                  x={config.labelPos.x}
                  y={config.labelPos.y + 26}
                  textAnchor="middle"
                  className="select-none pointer-events-none"
                  fill="white"
                  fontSize="9"
                  fontWeight="600"
                  style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.75)', strokeWidth: 3, strokeLinejoin: 'round' }}
                >
                  {stats.caught}/{stats.total} · {progress}%
                </text>
              </g>
            );
          })}

          {/* Mount Coronet marker (center) */}
          <g pointerEvents="none">
            <circle cx="150" cy="188" r="6" fill="hsl(50, 100%, 60%)" opacity="0.35">
              <animate attributeName="r" values="5;9;5" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="188" r="3.5" fill="hsl(50, 100%, 70%)" stroke="white" strokeWidth="0.8" />
          </g>
        </svg>

        {/* Compass rose */}
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-background/60 border border-border/60 flex items-center justify-center text-[10px] text-muted-foreground pointer-events-none">
          <div className="absolute inset-0 flex items-start justify-center pt-1 text-primary font-bold">N</div>
          <Compass className="w-4 h-4 opacity-60" />
        </div>
      </div>

      {/* Region quick-select row */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {REGION_DRAW_ORDER.map((id) => {
          const config = REGION_CONFIG[id];
          const location = locations?.find((l) => l.id === id);
          if (!config || !location) return null;

          const isSelected = selectedRegion === id;
          const stats = regionStats[id] || { total: 0, caught: 0, alpha: 0 };
          const progress = stats.total > 0 ? Math.round((stats.caught / stats.total) * 100) : 0;
          const name = isRTL ? location.name_ar : location.name_en;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedRegion(isSelected ? null : id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all',
                'bg-secondary/40 hover:bg-secondary/70',
                isSelected
                  ? 'border-primary ring-1 ring-primary/40 bg-primary/10'
                  : 'border-border/50'
              )}
              aria-pressed={isSelected}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                style={{ backgroundColor: config.fill }}
              >
                <span className="text-base leading-none">{config.icon}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold truncate">{name}</span>
                <span className="block text-[10px] text-muted-foreground">
                  {stats.caught}/{stats.total} · {progress}%
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Region Panel */}
      {selectedLocation && (
        <div className="mt-4 animate-fade-in-up">
          <div className="glass rounded-2xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {REGION_CONFIG[selectedLocation.id]?.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">
                    {isRTL ? selectedLocation.name_ar : selectedLocation.name_en}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? selectedLocation.description_ar : selectedLocation.description_en}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    showFilters ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Region Progress */}
            <div className="mb-4 p-3 rounded-xl bg-secondary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('تقدم المنطقة', 'Region Progress')}</span>
                <span className="text-sm text-primary font-bold">
                  {regionStats[selectedLocation.id]?.caught || 0}/{regionStats[selectedLocation.id]?.total || 0}
                </span>
              </div>
              <Progress 
                value={regionStats[selectedLocation.id]?.total > 0 
                  ? (regionStats[selectedLocation.id]?.caught / regionStats[selectedLocation.id]?.total) * 100 
                  : 0
                } 
                className="h-2"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mb-4 p-3 bg-secondary/50 rounded-xl space-y-3 animate-fade-in-up">
                {/* Rarity filter */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    {t('الندرة', 'Rarity')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(RARITY_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setFilter(f => ({ 
                          ...f, 
                          rarity: f.rarity === key ? undefined : key 
                        }))}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-all",
                          filter.rarity === key
                            ? `${config.color} text-foreground`
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {isRTL ? config.label_ar : config.label_en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time filter */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    {t('الوقت', 'Time')}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter(f => ({ 
                        ...f, 
                        timeOfDay: f.timeOfDay === 'day' ? undefined : 'day' 
                      }))}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all",
                        filter.timeOfDay === 'day'
                          ? "bg-yellow-500 text-background"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Sun className="w-3 h-3" />
                      {t('نهار', 'Day')}
                    </button>
                    <button
                      onClick={() => setFilter(f => ({ 
                        ...f, 
                        timeOfDay: f.timeOfDay === 'night' ? undefined : 'night' 
                      }))}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all",
                        filter.timeOfDay === 'night'
                          ? "bg-indigo-500 text-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Moon className="w-3 h-3" />
                      {t('ليل', 'Night')}
                    </button>
                  </div>
                </div>

                {/* Alpha filter */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    {t('ألفا فقط', 'Alpha Only')}
                  </label>
                  <button
                    onClick={() => setFilter(f => ({ 
                      ...f, 
                      alpha: f.alpha === true ? undefined : true 
                    }))}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all",
                      filter.alpha === true
                        ? "bg-red-500 text-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Sparkles className="w-3 h-3" />
                    {t('ألفا', 'Alpha')}
                  </button>
                </div>

                {/* Clear filters */}
                {(filter.rarity || filter.timeOfDay || filter.alpha) && (
                  <button
                    onClick={() => setFilter({})}
                    className="text-xs text-primary hover:underline"
                  >
                    {t('مسح الفلاتر', 'Clear Filters')}
                  </button>
                )}
              </div>
            )}

            {/* Subareas */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {t('المناطق الفرعية', 'Subareas')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedLocation.subareas.map((area, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {isRTL ? area.name_ar : area.name_en}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Pokemon spawns */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center justify-between">
                <span>{t('البوكيمونات', 'Pokémon')}</span>
                <span className="text-xs">
                  {regionSpawns.length} {t('نوع', 'species')}
                </span>
              </h4>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {regionSpawns.map((spawn) => {
                  const poke = pokemonMap.get(spawn.pokemon_id);
                  if (!poke) return null;

                  const entry = livingDexMap?.get(poke.id);
                  const isCaught = entry?.caught;

                  return (
                    <Link
                      key={spawn.id}
                      to={`/pokemon/${poke.id}`}
                      className={cn(
                        "group relative flex flex-col items-center p-2 rounded-xl transition-all",
                        "bg-secondary/50 hover:bg-secondary hover:scale-105",
                        spawn.is_alpha && "ring-1 ring-red-500/50",
                        isCaught && "ring-1 ring-green-500/50"
                      )}
                    >
                      {/* Caught indicator */}
                      {isCaught && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle2 className="w-2.5 h-2.5 text-foreground" />
                        </div>
                      )}

                      {/* Alpha badge */}
                      {spawn.is_alpha && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                          <Sparkles className="w-2 h-2 text-foreground" />
                        </div>
                      )}

                      {/* Pokemon image */}
                      <PokemonImage
                        pokemonId={poke.id}
                        dexNo={poke.dex_no}
                        name={isRTL ? poke.name_ar : poke.name_en}
                        currentImages={poke.images}
                        size="sm"
                        className={cn("w-12 h-12", !isCaught && "opacity-60")}
                      />

                      {/* Name */}
                      <span className="text-[10px] text-center truncate w-full mt-1">
                        {isRTL ? poke.name_ar : poke.name_en}
                      </span>

                      {/* Rarity indicator */}
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1",
                        RARITY_CONFIG[spawn.rarity].color
                      )} />
                    </Link>
                  );
                })}
              </div>

              {regionSpawns.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {t('لا توجد نتائج للفلاتر المحددة', 'No results for selected filters')}
                </div>
              )}
            </div>

            {/* View full location link */}
            <Link
              to={`/locations/${selectedLocation.id}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              {t('عرض التفاصيل الكاملة', 'View Full Details')}
              <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
            </Link>
          </div>
        </div>
      )}

      {/* Legend */}
      {!selectedRegion && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            {t('شائع', 'Common')}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            {t('غير شائع', 'Uncommon')}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            {t('نادر', 'Rare')}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600" />
            {t('نادر جداً', 'Very Rare')}
          </div>
        </div>
      )}
    </div>
  );
}
