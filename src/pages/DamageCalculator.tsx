import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { PokemonImageWithFallback } from '@/components/PokemonImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, Search, Swords, Shield, Zap,
  ChevronRight, Flame, Droplets, Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Pokemon, Move, PokemonType } from '@/types/pokemon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const TYPE_COLORS: Record<string, string> = {
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

// Type effectiveness chart
const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  normal: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  fire: { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1 },
  water: { normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },
  electric: { normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },
  grass: { normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1 },
  ice: { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1 },
  fighting: { normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 2, fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5 },
  poison: { normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1, fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2 },
  ground: { normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1, fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
  flying: { normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  psychic: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1 },
  bug: { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1, fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2, bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2, fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  ghost: { normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 1 },
  dragon: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 0 },
  dark: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 0.5 },
  steel: { normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2 },
  fairy: { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 2, steel: 0.5, fairy: 1 },
};

function getTypeEffectiveness(moveType: PokemonType, defenderTypes: PokemonType[]): number {
  let multiplier = 1;
  for (const defType of defenderTypes) {
    multiplier *= TYPE_CHART[moveType]?.[defType] ?? 1;
  }
  return multiplier;
}

function calculateDamage(
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  level: number = 50
): { min: number; max: number; effectiveness: number } {
  if (move.category === 'status' || !move.power) {
    return { min: 0, max: 0, effectiveness: 1 };
  }

  const isPhysical = move.category === 'physical';
  const attack = isPhysical ? attacker.stats.atk : attacker.stats.spa;
  const defense = isPhysical ? defender.stats.def : defender.stats.spd;

  // STAB (Same Type Attack Bonus)
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;

  // Type effectiveness
  const effectiveness = getTypeEffectiveness(move.type, defender.types);

  // Base damage formula (simplified)
  const baseDamage = Math.floor(
    ((2 * level / 5 + 2) * move.power * attack / defense / 50 + 2) * stab * effectiveness
  );

  // Random factor (0.85 to 1.0)
  const minDamage = Math.floor(baseDamage * 0.85);
  const maxDamage = baseDamage;

  return { min: minDamage, max: maxDamage, effectiveness };
}

export default function DamageCalculatorPage() {
  const { t, lang } = useLanguage();
  const [attacker, setAttacker] = useState<Pokemon | null>(null);
  const [defender, setDefender] = useState<Pokemon | null>(null);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectingFor, setSelectingFor] = useState<'attacker' | 'defender' | 'move' | null>(null);

  const allPokemon = useLiveQuery(() => db.pokemon.orderBy('dex_no').toArray());
  const allMoves = useLiveQuery(() => db.moves.toArray());

  const attackerMoves = useLiveQuery(async () => {
    if (!attacker) return [];
    const moveIds = attacker.learnset?.map(l => l.move_id) || [];
    const moves = await db.moves.where('id').anyOf(moveIds).toArray();
    return moves.filter(m => m.category !== 'status' && m.power);
  }, [attacker]);

  const filteredPokemon = allPokemon?.filter(p => {
    if (!searchQuery) return true;
    return (
      p.name_ar.includes(searchQuery) ||
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.dex_no).includes(searchQuery)
    );
  });

  const filteredMoves = (attackerMoves || allMoves)?.filter(m => {
    if (!searchQuery) return true;
    return (
      m.name_ar.includes(searchQuery) ||
      m.name_en.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const result = attacker && defender && selectedMove
    ? calculateDamage(attacker, defender, selectedMove)
    : null;

  const getEffectivenessText = (eff: number) => {
    if (eff === 0) return { text: t('لا تأثير!', 'No effect!'), color: 'text-zinc-500' };
    if (eff === 0.25) return { text: t('غير فعال جداً', 'Barely effective'), color: 'text-red-500' };
    if (eff === 0.5) return { text: t('غير فعال', 'Not very effective'), color: 'text-orange-500' };
    if (eff === 2) return { text: t('فعال جداً!', 'Super effective!'), color: 'text-emerald-500' };
    if (eff === 4) return { text: t('فعال للغاية!!', 'Extremely effective!!'), color: 'text-emerald-400' };
    return { text: t('فعال', 'Effective'), color: 'text-foreground' };
  };

  return (
    <div className="pb-20 pt-4 min-h-screen">
      <div className="container px-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              {t('حاسبة الضرر', 'Damage Calculator')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('احسب ضرر الحركات بين البوكيمونات', 'Calculate move damage between Pokémon')}
            </p>
          </div>
        </div>

        {/* Calculator UI */}
        <div className="space-y-4">
          {/* Attacker & Defender Selection */}
          <div className="grid grid-cols-2 gap-4">
            {/* Attacker */}
            <Dialog open={selectingFor === 'attacker'} onOpenChange={(open) => setSelectingFor(open ? 'attacker' : null)}>
              <DialogTrigger asChild>
                <button className="glass rounded-xl p-4 text-start hover:border-primary/50 transition-colors">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Swords className="w-3 h-3" />
                    {t('المهاجم', 'Attacker')}
                  </div>
                  {attacker ? (
                    <div className="flex flex-col items-center">
                      <PokemonImageWithFallback
                        pokemonId={attacker.id}
                        pokemonName={attacker.name_en}
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-sm font-medium mt-1">
                        {lang === 'ar' ? attacker.name_ar : attacker.name_en}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                        <Swords className="w-6 h-6" />
                      </div>
                      <span className="text-sm mt-1">{t('اختر', 'Select')}</span>
                    </div>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{t('اختر المهاجم', 'Select Attacker')}</DialogTitle>
                </DialogHeader>
                <div className="relative mb-4">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('بحث...', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-9"
                  />
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-3 gap-2">
                    {filteredPokemon?.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setAttacker(p);
                          setSelectingFor(null);
                          setSearchQuery('');
                          setSelectedMove(null);
                        }}
                        className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors flex flex-col items-center"
                      >
                        <PokemonImageWithFallback
                          pokemonId={p.id}
                          pokemonName={p.name_en}
                          className="w-12 h-12 object-contain"
                        />
                        <span className="text-xs mt-1 text-center line-clamp-1">
                          {lang === 'ar' ? p.name_ar : p.name_en}
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* Defender */}
            <Dialog open={selectingFor === 'defender'} onOpenChange={(open) => setSelectingFor(open ? 'defender' : null)}>
              <DialogTrigger asChild>
                <button className="glass rounded-xl p-4 text-start hover:border-primary/50 transition-colors">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {t('المدافع', 'Defender')}
                  </div>
                  {defender ? (
                    <div className="flex flex-col items-center">
                      <PokemonImageWithFallback
                        pokemonId={defender.id}
                        pokemonName={defender.name_en}
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-sm font-medium mt-1">
                        {lang === 'ar' ? defender.name_ar : defender.name_en}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                        <Shield className="w-6 h-6" />
                      </div>
                      <span className="text-sm mt-1">{t('اختر', 'Select')}</span>
                    </div>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{t('اختر المدافع', 'Select Defender')}</DialogTitle>
                </DialogHeader>
                <div className="relative mb-4">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('بحث...', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-9"
                  />
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-3 gap-2">
                    {filteredPokemon?.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setDefender(p);
                          setSelectingFor(null);
                          setSearchQuery('');
                        }}
                        className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors flex flex-col items-center"
                      >
                        <PokemonImageWithFallback
                          pokemonId={p.id}
                          pokemonName={p.name_en}
                          className="w-12 h-12 object-contain"
                        />
                        <span className="text-xs mt-1 text-center line-clamp-1">
                          {lang === 'ar' ? p.name_ar : p.name_en}
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          {/* Move Selection */}
          {attacker && (
            <Dialog open={selectingFor === 'move'} onOpenChange={(open) => setSelectingFor(open ? 'move' : null)}>
              <DialogTrigger asChild>
                <button className="w-full glass rounded-xl p-4 text-start hover:border-primary/50 transition-colors">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {t('الحركة', 'Move')}
                  </div>
                  {selectedMove ? (
                    <div className="flex items-center gap-3">
                      <Badge className={cn('capitalize', TYPE_COLORS[selectedMove.type])}>
                        {selectedMove.type}
                      </Badge>
                      <span className="font-medium">
                        {lang === 'ar' ? selectedMove.name_ar : selectedMove.name_en}
                      </span>
                      <span className="text-sm text-muted-foreground ms-auto">
                        {t('قوة', 'Power')}: {selectedMove.power}
                      </span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span>{t('اختر حركة', 'Select a move')}</span>
                    </div>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{t('اختر حركة', 'Select Move')}</DialogTitle>
                </DialogHeader>
                <div className="relative mb-4">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('بحث...', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-9"
                  />
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {filteredMoves?.map(m => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMove(m);
                          setSelectingFor(null);
                          setSearchQuery('');
                        }}
                        className="w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors flex items-center gap-3"
                      >
                        <Badge className={cn('capitalize shrink-0', TYPE_COLORS[m.type])}>
                          {m.type}
                        </Badge>
                        <span className="font-medium">
                          {lang === 'ar' ? m.name_ar : m.name_en}
                        </span>
                        <div className="ms-auto text-sm text-muted-foreground flex gap-2">
                          <span>{m.category}</span>
                          {m.power && <span>⚡{m.power}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}

          {/* Results */}
          {result && (
            <div className="glass rounded-xl p-6 animate-fade-in-up">
              <h2 className="text-lg font-semibold mb-4 text-center">
                {t('نتيجة الحساب', 'Calculation Result')}
              </h2>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <PokemonImageWithFallback
                    pokemonId={attacker!.id}
                    pokemonName={attacker!.name_en}
                    className="w-16 h-16 object-contain mx-auto"
                  />
                  <span className="text-xs">{lang === 'ar' ? attacker!.name_ar : attacker!.name_en}</span>
                </div>
                <ChevronRight className="w-8 h-8 text-primary" />
                <div className="text-center">
                  <PokemonImageWithFallback
                    pokemonId={defender!.id}
                    pokemonName={defender!.name_en}
                    className="w-16 h-16 object-contain mx-auto"
                  />
                  <span className="text-xs">{lang === 'ar' ? defender!.name_ar : defender!.name_en}</span>
                </div>
              </div>

              {/* Effectiveness */}
              <div className={cn('text-center text-lg font-bold mb-4', getEffectivenessText(result.effectiveness).color)}>
                {getEffectivenessText(result.effectiveness).text}
              </div>

              {/* Damage Range */}
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {result.min} - {result.max}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {t('نطاق الضرر', 'Damage Range')}
                </div>
                
                {/* HP Percentage */}
                {defender && (
                  <div className="mt-3 text-sm">
                    <span className="text-muted-foreground">
                      {t('من HP المدافع:', 'Of defender HP:')}
                    </span>
                    <span className="font-medium ms-2">
                      {Math.round((result.min / defender.stats.hp) * 100)}% - {Math.round((result.max / defender.stats.hp) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Move Info */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <Badge className={cn('capitalize', TYPE_COLORS[selectedMove!.type])}>
                  {selectedMove!.type}
                </Badge>
                <span className="mx-2">•</span>
                <span className="capitalize">{selectedMove!.category}</span>
                <span className="mx-2">•</span>
                <span>{t('قوة', 'Power')}: {selectedMove!.power}</span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!attacker && !defender && (
            <div className="text-center py-12">
              <Calculator className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {t('اختر البوكيمونات', 'Select Pokémon')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('اختر المهاجم والمدافع لحساب الضرر', 'Choose attacker and defender to calculate damage')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
