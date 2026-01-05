import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  caught: number;
  totalPokemon: number;
  percentage: number;
  nextMilestone: number;
  remaining: number;
}

export function StatsCard({
  caught,
  totalPokemon,
  percentage,
  nextMilestone,
  remaining,
}: StatsCardProps) {
  const { t } = useLanguage();

  return (
    <div className="glass rounded-2xl p-6 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-gold/5 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-16 h-16 rounded-xl flex items-center justify-center',
              percentage >= 100 
                ? 'bg-gradient-to-br from-gold/30 to-yellow-500/30' 
                : 'bg-gradient-to-br from-primary/20 to-accent/20'
            )}>
              <Trophy className={cn('w-8 h-8', percentage >= 100 ? 'text-gold' : 'text-primary')} />
            </div>
            <div>
              <div className="text-3xl font-bold">
                {caught} <span className="text-muted-foreground text-lg">/ {totalPokemon}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {t('بوكيمون مُمسك', 'Pokémon caught')}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gradient">{percentage.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">{t('نسبة الإكمال', 'Completion')}</div>
          </div>
        </div>
        <Progress value={percentage} className="h-4 mb-3" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t('الهدف التالي', 'Next milestone')}: <span className="text-primary font-medium">{nextMilestone}</span>
          </span>
          <span className="text-muted-foreground">
            {t('متبقي', 'Remaining')}: <span className="text-primary font-medium">{remaining}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
