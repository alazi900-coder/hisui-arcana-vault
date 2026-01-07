import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, GitBranch, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PokemonImage } from '@/components/PokemonImage';
import type { Pokemon } from '@/types/pokemon';

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

interface EvolutionChainProps {
  pokemon: Pokemon;
  evolutions: Pokemon[];
  allPokemon: Pokemon[];
}

export function EvolutionChain({ pokemon, evolutions, allPokemon }: EvolutionChainProps) {
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
                  
                  <PokemonImage 
                    pokemonId={preEvolution.id}
                    dexNo={preEvolution.dex_no}
                    name={preEvolution.name_en}
                    currentImages={preEvolution.images}
                    size="md" 
                    className="mb-3" 
                  />
                  
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
                
                <PokemonImage 
                  pokemonId={pokemon.id}
                  dexNo={pokemon.dex_no}
                  name={pokemon.name_en}
                  currentImages={pokemon.images}
                  size="lg" 
                  className="mb-4" 
                />
                
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
                          
                          <PokemonImage 
                            pokemonId={evolvedPokemon.id}
                            dexNo={evolvedPokemon.dex_no}
                            name={evolvedPokemon.name_en}
                            currentImages={evolvedPokemon.images}
                            size="md" 
                            className="mb-3" 
                          />
                          
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
