import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { GitCompare, ChevronDown } from 'lucide-react';
import type { Pokemon } from '@/types/pokemon';

const statLabels = {
  hp: { ar: 'ص.ح', en: 'HP' },
  atk: { ar: 'هجوم', en: 'Atk' },
  def: { ar: 'دفاع', en: 'Def' },
  spa: { ar: 'هـ.خ', en: 'SpA' },
  spd: { ar: 'د.خ', en: 'SpD' },
  spe: { ar: 'سرعة', en: 'Spe' },
};

const statColors = {
  hp: 'bg-type-grass',
  atk: 'bg-destructive',
  def: 'bg-type-rock',
  spa: 'bg-primary',
  spd: 'bg-type-psychic',
  spe: 'bg-type-electric',
};

export default function ComparePage() {
  const { t } = useLanguage();
  const [pokemon1Id, setPokemon1Id] = useState<string | null>(null);
  const [pokemon2Id, setPokemon2Id] = useState<string | null>(null);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  const allPokemon = useLiveQuery(() => db.pokemon.toArray(), []);
  const pokemon1 = useLiveQuery(() => pokemon1Id ? db.pokemon.get(pokemon1Id) : undefined, [pokemon1Id]);
  const pokemon2 = useLiveQuery(() => pokemon2Id ? db.pokemon.get(pokemon2Id) : undefined, [pokemon2Id]);

  const getBST = (pokemon: Pokemon) => 
    pokemon.stats.hp + pokemon.stats.atk + pokemon.stats.def + 
    pokemon.stats.spa + pokemon.stats.spd + pokemon.stats.spe;

  const renderPokemonSelector = (
    selected: Pokemon | undefined,
    setId: (id: string) => void,
    showDropdown: boolean,
    setShowDropdown: (show: boolean) => void,
    label: string
  ) => (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full glass rounded-xl p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <img 
              src={selected.images.thumb} 
              alt={t(selected.name_ar, selected.name_en)}
              className="w-10 h-10"
            />
            <div className="text-start">
              <div className="font-semibold">{t(selected.name_ar, selected.name_en)}</div>
              <div className="text-xs text-muted-foreground">#{String(selected.dex_no).padStart(3, '0')}</div>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">{label}</span>
        )}
        <ChevronDown className={cn('w-5 h-5 transition-transform', showDropdown && 'rotate-180')} />
      </button>

      {showDropdown && (
        <div className="absolute z-20 top-full mt-2 start-0 end-0 glass rounded-xl max-h-60 overflow-y-auto">
          {allPokemon?.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setId(p.id);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors"
            >
              <img src={p.images.thumb} alt="" className="w-8 h-8" />
              <span className="text-sm">{t(p.name_ar, p.name_en)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderStatComparison = (statKey: keyof typeof statLabels) => {
    const val1 = pokemon1?.stats[statKey] || 0;
    const val2 = pokemon2?.stats[statKey] || 0;
    const max = Math.max(val1, val2, 1);
    
    return (
      <div key={statKey} className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{t(statLabels[statKey].ar, statLabels[statKey].en)}</span>
        </div>
        <div className="flex gap-2 items-center">
          {/* Pokemon 1 bar (reversed) */}
          <div className="flex-1 flex justify-end">
            <div className="w-full h-6 bg-secondary rounded-s-full overflow-hidden flex justify-end">
              <div 
                className={cn('h-full rounded-s-full flex items-center justify-end pe-2', statColors[statKey])}
                style={{ width: `${(val1 / 255) * 100}%` }}
              >
                <span className={cn(
                  'text-xs font-bold',
                  val1 > val2 ? 'text-foreground' : 'text-foreground/70'
                )}>
                  {val1}
                </span>
              </div>
            </div>
          </div>
          
          {/* Pokemon 2 bar */}
          <div className="flex-1">
            <div className="w-full h-6 bg-secondary rounded-e-full overflow-hidden">
              <div 
                className={cn('h-full rounded-e-full flex items-center ps-2', statColors[statKey])}
                style={{ width: `${(val2 / 255) * 100}%` }}
              >
                <span className={cn(
                  'text-xs font-bold',
                  val2 > val1 ? 'text-foreground' : 'text-foreground/70'
                )}>
                  {val2}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/20">
            <GitCompare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              {t('المقارنة', 'Compare')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('قارن بين بوكيمونين', 'Compare two Pokémon')}
            </p>
          </div>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {renderPokemonSelector(
            pokemon1,
            setPokemon1Id,
            showDropdown1,
            setShowDropdown1,
            t('اختر الأول', 'Select first')
          )}
          {renderPokemonSelector(
            pokemon2,
            setPokemon2Id,
            showDropdown2,
            setShowDropdown2,
            t('اختر الثاني', 'Select second')
          )}
        </div>

        {/* Comparison */}
        {pokemon1 && pokemon2 && (
          <div className="animate-fade-in-up">
            {/* Images */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center">
                <img 
                  src={pokemon1.images.artwork} 
                  alt={t(pokemon1.name_ar, pokemon1.name_en)}
                  className="w-24 h-24 mx-auto mb-2"
                />
                <h3 className="font-semibold">{t(pokemon1.name_ar, pokemon1.name_en)}</h3>
                <div className="flex justify-center gap-1 mt-2">
                  {pokemon1.types.map(type => (
                    <span 
                      key={type}
                      className="px-2 py-0.5 text-[10px] rounded-full capitalize"
                      style={{
                        backgroundColor: `hsl(var(--type-${type}) / 0.2)`,
                        color: `hsl(var(--type-${type}))`
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <img 
                  src={pokemon2.images.artwork} 
                  alt={t(pokemon2.name_ar, pokemon2.name_en)}
                  className="w-24 h-24 mx-auto mb-2"
                />
                <h3 className="font-semibold">{t(pokemon2.name_ar, pokemon2.name_en)}</h3>
                <div className="flex justify-center gap-1 mt-2">
                  {pokemon2.types.map(type => (
                    <span 
                      key={type}
                      className="px-2 py-0.5 text-[10px] rounded-full capitalize"
                      style={{
                        backgroundColor: `hsl(var(--type-${type}) / 0.2)`,
                        color: `hsl(var(--type-${type}))`
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Comparison */}
            <div className="glass rounded-xl p-4 mb-4">
              <h2 className="font-semibold text-center mb-4">{t('الإحصائيات', 'Stats')}</h2>
              {Object.keys(statLabels).map(key => renderStatComparison(key as keyof typeof statLabels))}
            </div>

            {/* BST Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                'glass rounded-xl p-4 text-center',
                getBST(pokemon1) > getBST(pokemon2) && 'border border-gold/50'
              )}>
                <div className="text-xs text-muted-foreground mb-1">BST</div>
                <div className={cn(
                  'text-2xl font-bold',
                  getBST(pokemon1) > getBST(pokemon2) ? 'text-gold' : 'text-foreground'
                )}>
                  {getBST(pokemon1)}
                </div>
              </div>
              <div className={cn(
                'glass rounded-xl p-4 text-center',
                getBST(pokemon2) > getBST(pokemon1) && 'border border-gold/50'
              )}>
                <div className="text-xs text-muted-foreground mb-1">BST</div>
                <div className={cn(
                  'text-2xl font-bold',
                  getBST(pokemon2) > getBST(pokemon1) ? 'text-gold' : 'text-foreground'
                )}>
                  {getBST(pokemon2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!pokemon1 || !pokemon2) && (
          <div className="text-center py-12 text-muted-foreground">
            {t('اختر بوكيمونين للمقارنة', 'Select two Pokémon to compare')}
          </div>
        )}
      </div>
    </div>
  );
}