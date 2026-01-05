import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { PokemonImage } from '@/components/PokemonImage';
import { Search, X, MapPin } from 'lucide-react';
import type { Spawn, Pokemon, Location } from '@/types/pokemon';

interface RegionConfig {
  icon: string;
}

interface SearchOverlayProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Array<{ spawn: Spawn; pokemon: Pokemon; location: Location }>;
  regionConfig: Record<string, RegionConfig>;
  onSelectRegion: (locationId: string) => void;
  onClose: () => void;
}

export function SearchOverlay({
  searchQuery,
  setSearchQuery,
  searchResults,
  regionConfig,
  onSelectRegion,
  onClose,
}: SearchOverlayProps) {
  const { t, isRTL } = useLanguage();

  return (
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
                  onSelectRegion(location.id);
                  onClose();
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
                    {regionConfig[location.id]?.icon}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
