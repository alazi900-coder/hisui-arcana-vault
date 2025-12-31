import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Grid3X3, Info, X, Shield, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PokemonType } from '@/types/pokemon';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const TYPE_NAMES: Record<PokemonType, { ar: string; en: string }> = {
  normal: { ar: 'عادي', en: 'Normal' },
  fire: { ar: 'ناري', en: 'Fire' },
  water: { ar: 'مائي', en: 'Water' },
  electric: { ar: 'كهربائي', en: 'Electric' },
  grass: { ar: 'عشبي', en: 'Grass' },
  ice: { ar: 'جليدي', en: 'Ice' },
  fighting: { ar: 'قتالي', en: 'Fighting' },
  poison: { ar: 'سام', en: 'Poison' },
  ground: { ar: 'أرضي', en: 'Ground' },
  flying: { ar: 'طائر', en: 'Flying' },
  psychic: { ar: 'نفسي', en: 'Psychic' },
  bug: { ar: 'حشري', en: 'Bug' },
  rock: { ar: 'صخري', en: 'Rock' },
  ghost: { ar: 'شبحي', en: 'Ghost' },
  dragon: { ar: 'تنيني', en: 'Dragon' },
  dark: { ar: 'مظلم', en: 'Dark' },
  steel: { ar: 'فولاذي', en: 'Steel' },
  fairy: { ar: 'خيالي', en: 'Fairy' },
};

// Type effectiveness chart - attacking type -> defending type -> multiplier
const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, dragon: 1, dark: 1, fairy: 1 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2, normal: 1, electric: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, ghost: 1, dark: 1, fairy: 1 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5, normal: 1, electric: 1, ice: 1, fighting: 1, poison: 1, flying: 1, psychic: 1, bug: 1, ghost: 1, dark: 1, steel: 1, fairy: 1 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5, normal: 1, fire: 1, ice: 1, fighting: 1, poison: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dark: 1, steel: 1, fairy: 1 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5, normal: 1, electric: 1, ice: 1, fighting: 1, psychic: 1, ghost: 1, dark: 1, fairy: 1 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5, normal: 1, electric: 1, fighting: 1, poison: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dark: 1, fairy: 1 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5, fire: 1, water: 1, electric: 1, grass: 1, ground: 1, dragon: 1 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2, normal: 1, fire: 1, water: 1, electric: 1, ice: 1, fighting: 1, flying: 1, psychic: 1, bug: 1, dragon: 1, dark: 1 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2, normal: 1, water: 1, ice: 1, fighting: 1, ground: 1, psychic: 1, ghost: 1, dragon: 1, dark: 1, fairy: 1 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5, normal: 1, fire: 1, water: 1, ice: 1, poison: 1, ground: 1, flying: 1, psychic: 1, ghost: 1, dragon: 1, dark: 1, fairy: 1 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, ground: 1, flying: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, fairy: 1 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5, normal: 1, water: 1, electric: 1, ice: 1, ground: 1, bug: 1, rock: 1, dragon: 1 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5, normal: 1, water: 1, electric: 1, grass: 1, poison: 1, psychic: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, fairy: 1 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, bug: 1, rock: 1, dragon: 1, steel: 1, fairy: 1 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dark: 1 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5, normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, poison: 1, ground: 1, flying: 1, bug: 1, rock: 1, dragon: 1, steel: 1 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2, normal: 1, grass: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, ghost: 1, dragon: 1, dark: 1 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5, normal: 1, water: 1, electric: 1, grass: 1, ice: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, fairy: 1 },
};

const TYPE_COLORS: Record<PokemonType, string> = {
  normal: 'bg-type-normal',
  fire: 'bg-type-fire',
  water: 'bg-type-water',
  electric: 'bg-type-electric',
  grass: 'bg-type-grass',
  ice: 'bg-type-ice',
  fighting: 'bg-type-fighting',
  poison: 'bg-type-poison',
  ground: 'bg-type-ground',
  flying: 'bg-type-flying',
  psychic: 'bg-type-psychic',
  bug: 'bg-type-bug',
  rock: 'bg-type-rock',
  ghost: 'bg-type-ghost',
  dragon: 'bg-type-dragon',
  dark: 'bg-type-dark',
  steel: 'bg-type-steel',
  fairy: 'bg-type-fairy',
};

export default function TypeChartPage() {
  const { t, lang } = useLanguage();
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);

  const getEffectiveness = (attacker: PokemonType, defender: PokemonType) => {
    return TYPE_CHART[attacker]?.[defender] ?? 1;
  };

  const getCellClass = (multiplier: number) => {
    if (multiplier === 0) return 'bg-zinc-800 text-zinc-500';
    if (multiplier === 0.5) return 'bg-red-900/50 text-red-300';
    if (multiplier === 2) return 'bg-emerald-900/50 text-emerald-300';
    return 'bg-secondary/30';
  };

  const getCellText = (multiplier: number) => {
    if (multiplier === 0) return '0';
    if (multiplier === 0.5) return '½';
    if (multiplier === 2) return '2';
    return '';
  };

  const getTypeDetails = (type: PokemonType) => {
    const superEffective: PokemonType[] = [];
    const notVeryEffective: PokemonType[] = [];
    const noEffect: PokemonType[] = [];
    const weakTo: PokemonType[] = [];
    const resistantTo: PokemonType[] = [];
    const immuneTo: PokemonType[] = [];

    ALL_TYPES.forEach(t => {
      const attackMult = getEffectiveness(type, t);
      const defenseMult = getEffectiveness(t, type);

      if (attackMult === 2) superEffective.push(t);
      if (attackMult === 0.5) notVeryEffective.push(t);
      if (attackMult === 0) noEffect.push(t);

      if (defenseMult === 2) weakTo.push(t);
      if (defenseMult === 0.5) resistantTo.push(t);
      if (defenseMult === 0) immuneTo.push(t);
    });

    return { superEffective, notVeryEffective, noEffect, weakTo, resistantTo, immuneTo };
  };

  return (
    <div className="pb-20 pt-4 min-h-screen">
      <div className="container px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Grid3X3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              {t('مخطط الأنواع', 'Type Chart')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('اضغط على أي نوع لعرض التفاصيل', 'Tap any type for details')}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="glass rounded-xl p-3 mb-4 flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-emerald-900/50 rounded" />
            <span>2× {t('فعال جداً', 'Super effective')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-900/50 rounded" />
            <span>½× {t('غير فعال', 'Not effective')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-zinc-800 rounded" />
            <span>0× {t('لا تأثير', 'No effect')}</span>
          </div>
        </div>

        {/* Type Chart Table */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="inline-block min-w-max">
            <div className="glass rounded-xl overflow-hidden">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="p-1 text-[10px] bg-secondary/50 sticky start-0 z-10">
                      <div className="flex items-center gap-1">
                        <Swords className="w-3 h-3" />
                        <span>→</span>
                        <Shield className="w-3 h-3" />
                      </div>
                    </th>
                    {ALL_TYPES.map(type => (
                      <th key={type} className="p-1">
                        <button
                          onClick={() => setSelectedType(type)}
                          className={cn(
                            'w-6 h-6 rounded text-[8px] font-bold uppercase',
                            TYPE_COLORS[type]
                          )}
                          title={TYPE_NAMES[type][lang]}
                        >
                          {type.slice(0, 3)}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_TYPES.map(attacker => (
                    <tr key={attacker}>
                      <td className="p-1 sticky start-0 bg-card z-10">
                        <button
                          onClick={() => setSelectedType(attacker)}
                          className={cn(
                            'w-full h-6 rounded text-[8px] font-bold uppercase px-1',
                            TYPE_COLORS[attacker]
                          )}
                        >
                          {TYPE_NAMES[attacker][lang].slice(0, 4)}
                        </button>
                      </td>
                      {ALL_TYPES.map(defender => {
                        const mult = getEffectiveness(attacker, defender);
                        return (
                          <td key={defender} className="p-0.5">
                            <div
                              className={cn(
                                'w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold',
                                getCellClass(mult)
                              )}
                            >
                              {getCellText(mult)}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Type Buttons */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">
            {t('اختر نوعاً للتفاصيل', 'Select a type for details')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {ALL_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  'px-3 py-2 rounded-lg font-medium text-sm capitalize transition-all',
                  TYPE_COLORS[type],
                  'hover:scale-105 hover:shadow-lg'
                )}
              >
                {TYPE_NAMES[type][lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Type Details Dialog */}
        <Dialog open={!!selectedType} onOpenChange={() => setSelectedType(null)}>
          <DialogContent className="max-w-md">
            {selectedType && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Badge className={cn('text-base', TYPE_COLORS[selectedType])}>
                      {TYPE_NAMES[selectedType][lang]}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                {(() => {
                  const details = getTypeDetails(selectedType);
                  return (
                    <div className="space-y-4">
                      {/* Offensive */}
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2">
                          <Swords className="w-4 h-4 text-primary" />
                          {t('هجومياً', 'Offensively')}
                        </h3>
                        
                        {details.superEffective.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-emerald-400">
                              2× {t('ضد', 'against')}:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {details.superEffective.map(t => (
                                <Badge key={t} className={cn('text-xs', TYPE_COLORS[t])}>
                                  {TYPE_NAMES[t][lang]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {details.notVeryEffective.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-red-400">
                              ½× {t('ضد', 'against')}:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {details.notVeryEffective.map(t => (
                                <Badge key={t} variant="secondary" className="text-xs">
                                  {TYPE_NAMES[t][lang]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {details.noEffect.length > 0 && (
                          <div>
                            <span className="text-xs text-zinc-500">
                              0× {t('ضد', 'against')}:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {details.noEffect.map(t => (
                                <Badge key={t} variant="outline" className="text-xs">
                                  {TYPE_NAMES[t][lang]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Defensive */}
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-accent" />
                          {t('دفاعياً', 'Defensively')}
                        </h3>
                        
                        {details.weakTo.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-red-400">
                              {t('ضعيف ضد', 'Weak to')} (2×):
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {details.weakTo.map(t => (
                                <Badge key={t} className={cn('text-xs', TYPE_COLORS[t])}>
                                  {TYPE_NAMES[t][lang]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {details.resistantTo.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-emerald-400">
                              {t('مقاوم ضد', 'Resistant to')} (½×):
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {details.resistantTo.map(t => (
                                <Badge key={t} variant="secondary" className="text-xs">
                                  {TYPE_NAMES[t][lang]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {details.immuneTo.length > 0 && (
                          <div>
                            <span className="text-xs text-zinc-500">
                              {t('محصن ضد', 'Immune to')} (0×):
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {details.immuneTo.map(t => (
                                <Badge key={t} variant="outline" className="text-xs">
                                  {TYPE_NAMES[t][lang]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
