import { useLanguage } from '@/contexts/LanguageContext';
import { getWeaknesses, getResistances, getImmunities } from '@/lib/type-chart';
import { Zap, Shield } from 'lucide-react';
import type { PokemonType } from '@/types/pokemon';

interface TypeEffectivenessSectionProps {
  types: PokemonType[];
}

export function TypeEffectivenessSection({ types }: TypeEffectivenessSectionProps) {
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
