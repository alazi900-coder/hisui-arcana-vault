import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface AchievementItem {
  id: string;
  tier: 1 | 2 | 3 | 4;
  icon: LucideIcon;
  name: string;
  desc: string;
  unlocked: boolean;
  color: string;
}

interface AchievementGridProps {
  achievements: AchievementItem[];
  unlockedCount: number;
}

export function AchievementGrid({ achievements, unlockedCount }: AchievementGridProps) {
  const { t } = useLanguage();

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold" />
          {t('الإنجازات', 'Achievements')}
        </h3>
        <span className="text-sm text-muted-foreground">
          {unlockedCount}/{achievements.length} {t('مفتوح', 'unlocked')}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map(ach => {
          const Icon = ach.icon;
          return (
            <div key={ach.id} className={cn(
              'p-3 rounded-xl border transition-all relative overflow-hidden',
              ach.unlocked 
                ? 'bg-gradient-to-br from-gold/10 to-transparent border-gold/30 shadow-lg shadow-gold/5' 
                : 'bg-secondary/30 border-border/30 opacity-60'
            )}>
              {ach.unlocked && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                </div>
              )}
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center mb-2',
                ach.unlocked ? 'bg-gold/20' : 'bg-muted/50'
              )}>
                <Icon className={cn('w-5 h-5', ach.unlocked ? ach.color : 'text-muted-foreground')} />
              </div>
              <div className={cn('font-medium text-sm mb-0.5', ach.unlocked && 'text-gold')}>
                {ach.name}
              </div>
              <p className="text-xs text-muted-foreground">{ach.desc}</p>
              <div className="mt-2">
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full',
                  ach.tier === 1 && 'bg-emerald-500/20 text-emerald-400',
                  ach.tier === 2 && 'bg-blue-500/20 text-blue-400',
                  ach.tier === 3 && 'bg-purple-500/20 text-purple-400',
                  ach.tier === 4 && 'bg-gold/20 text-gold',
                )}>
                  {ach.tier === 1 && t('برونزي', 'Bronze')}
                  {ach.tier === 2 && t('فضي', 'Silver')}
                  {ach.tier === 3 && t('ذهبي', 'Gold')}
                  {ach.tier === 4 && t('أسطوري', 'Legendary')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
