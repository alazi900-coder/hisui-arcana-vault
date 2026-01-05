import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PokemonImage } from '@/components/PokemonImage';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Spawn, Pokemon, LivingDexEntry } from '@/types/pokemon';

interface RarityConfig {
  color: string;
  label_ar: string;
  label_en: string;
}

interface SpawnListProps {
  spawns: Spawn[];
  pokemonMap: Map<string, Pokemon>;
  livingDexMap: Map<string, LivingDexEntry> | undefined;
  rarityConfig: Record<string, RarityConfig>;
}

export function SpawnList({ spawns, pokemonMap, livingDexMap, rarityConfig }: SpawnListProps) {
  const { t, isRTL } = useLanguage();

  if (spawns.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        {t('لا توجد نتائج للفلاتر المحددة', 'No results for selected filters')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-[300px] overflow-y-auto pr-1">
      {spawns.map((spawn) => {
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
              rarityConfig[spawn.rarity]?.color
            )} />
          </Link>
        );
      })}
    </div>
  );
}
