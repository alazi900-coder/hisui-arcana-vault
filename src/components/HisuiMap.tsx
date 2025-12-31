import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { Location, Spawn, Pokemon } from '@/types/pokemon';
import { PokemonImage } from './PokemonImage';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Star, 
  Sparkles, 
  Sun, 
  Moon, 
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Region colors and positions for the map
const REGION_CONFIG: Record<string, {
  color: string;
  gradient: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
  shape: string;
  icon: string;
}> = {
  'obsidian-fieldlands': {
    color: 'hsl(120, 60%, 35%)',
    gradient: 'from-green-600/80 to-emerald-800/80',
    position: { top: '55%', left: '15%' },
    size: { width: '25%', height: '30%' },
    shape: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 0% 30%)',
    icon: '🌲',
  },
  'crimson-mirelands': {
    color: 'hsl(15, 70%, 45%)',
    gradient: 'from-orange-600/80 to-red-900/80',
    position: { top: '45%', left: '35%' },
    size: { width: '22%', height: '28%' },
    shape: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
    icon: '🏜️',
  },
  'cobalt-coastlands': {
    color: 'hsl(200, 80%, 45%)',
    gradient: 'from-blue-500/80 to-cyan-700/80',
    position: { top: '60%', left: '55%' },
    size: { width: '28%', height: '32%' },
    shape: 'polygon(10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)',
    icon: '🌊',
  },
  'coronet-highlands': {
    color: 'hsl(260, 40%, 45%)',
    gradient: 'from-purple-600/80 to-indigo-900/80',
    position: { top: '15%', left: '40%' },
    size: { width: '24%', height: '35%' },
    shape: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    icon: '⛰️',
  },
  'alabaster-icelands': {
    color: 'hsl(200, 30%, 75%)',
    gradient: 'from-cyan-300/80 to-blue-400/80',
    position: { top: '5%', left: '60%' },
    size: { width: '30%', height: '28%' },
    shape: 'polygon(20% 0%, 80% 0%, 100% 30%, 90% 100%, 10% 100%, 0% 30%)',
    icon: '❄️',
  },
};

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

  // Fetch data
  const locations = useLiveQuery(() => db.locations.toArray(), []);
  const spawns = useLiveQuery(() => db.spawns.toArray(), []);
  const pokemon = useLiveQuery(() => db.pokemon.toArray(), []);

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

    // Remove duplicates by pokemon_id
    const seen = new Set<string>();
    return filtered.filter(s => {
      if (seen.has(s.pokemon_id)) return false;
      seen.add(s.pokemon_id);
      return true;
    });
  }, [selectedRegion, spawns, filter]);

  // Get spawn counts per region
  const spawnCounts = useMemo(() => {
    if (!spawns) return {};
    const counts: Record<string, number> = {};
    spawns.forEach(s => {
      counts[s.location_id] = (counts[s.location_id] || 0) + 1;
    });
    return counts;
  }, [spawns]);

  // Get selected location details
  const selectedLocation = locations?.find(l => l.id === selectedRegion);

  return (
    <div className={cn("relative", className)}>
      {/* Interactive Map */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-background via-card to-background rounded-2xl overflow-hidden border border-border/50">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(185_100%_50%_/_0.05)_0%,_transparent_70%)]" />
        <div className="absolute top-4 left-4 text-xs text-muted-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {t('منطقة هيسوي', 'Hisui Region')}
        </div>

        {/* Central Mount Coronet indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>

        {/* Region nodes */}
        {locations?.map((location) => {
          const config = REGION_CONFIG[location.id];
          if (!config) return null;

          const isSelected = selectedRegion === location.id;
          const spawnCount = spawnCounts[location.id] || 0;

          return (
            <button
              key={location.id}
              onClick={() => setSelectedRegion(isSelected ? null : location.id)}
              className={cn(
                "absolute transition-all duration-300 rounded-2xl group",
                "hover:scale-110 hover:z-20",
                isSelected && "scale-110 z-20"
              )}
              style={{
                top: config.position.top,
                left: config.position.left,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Region card */}
              <div className={cn(
                "relative px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300",
                "bg-gradient-to-br",
                config.gradient,
                isSelected 
                  ? "border-primary shadow-lg shadow-primary/20 glow-cyan" 
                  : "border-border/50 hover:border-primary/50"
              )}>
                {/* Icon */}
                <div className="text-2xl mb-1">{config.icon}</div>
                
                {/* Region name */}
                <div className="text-sm font-bold text-foreground whitespace-nowrap">
                  {isRTL ? location.name_ar : location.name_en}
                </div>
                
                {/* Spawn count badge */}
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Badge variant="outline" className="text-xs bg-background/50">
                    <Star className="w-3 h-3 mr-1" />
                    {spawnCount}
                  </Badge>
                </div>

                {/* Pulse ring when selected */}
                {isSelected && (
                  <div className="absolute -inset-2 rounded-2xl border-2 border-primary/50 animate-pulse" />
                )}
              </div>
            </button>
          );
        })}

        {/* Connection lines (decorative) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(185 100% 50% / 0.2)" />
              <stop offset="50%" stopColor="hsl(185 100% 50% / 0.4)" />
              <stop offset="100%" stopColor="hsl(185 100% 50% / 0.2)" />
            </linearGradient>
          </defs>
          {/* Connecting paths */}
          <path
            d="M 20% 55% Q 40% 50% 40% 35%"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            strokeDasharray="5 5"
            className="animate-pulse"
          />
          <path
            d="M 40% 45% Q 50% 55% 55% 60%"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            strokeDasharray="5 5"
            className="animate-pulse"
          />
          <path
            d="M 45% 30% Q 55% 20% 65% 15%"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            strokeDasharray="5 5"
            className="animate-pulse"
          />
        </svg>
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
                <div>
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

                  return (
                    <Link
                      key={spawn.id}
                      to={`/pokemon/${poke.id}`}
                      className={cn(
                        "group relative flex flex-col items-center p-2 rounded-xl transition-all",
                        "bg-secondary/50 hover:bg-secondary hover:scale-105",
                        spawn.is_alpha && "ring-1 ring-red-500/50"
                      )}
                    >
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
                        className="w-12 h-12"
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
