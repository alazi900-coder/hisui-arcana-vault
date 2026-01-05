import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Trophy, Star, Sparkles, Crown, Medal, Zap, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Achievement {
  id: string;
  tier: 1 | 2 | 3 | 4;
  icon: LucideIcon;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  color: string;
}

interface AchievementToastProps {
  achievement: Achievement;
  className?: string;
}

export function AchievementToast({ achievement, className }: AchievementToastProps) {
  const { t } = useLanguage();
  const Icon = achievement.icon;

  const tierColors = {
    1: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50',
    2: 'from-blue-500/20 to-blue-600/10 border-blue-500/50',
    3: 'from-purple-500/20 to-purple-600/10 border-purple-500/50',
    4: 'from-gold/20 to-yellow-600/10 border-gold/50',
  };

  const tierLabels = {
    1: t('برونزي', 'Bronze'),
    2: t('فضي', 'Silver'),
    3: t('ذهبي', 'Gold'),
    4: t('أسطوري', 'Legendary'),
  };

  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r animate-fade-in-up',
      tierColors[achievement.tier],
      className
    )}>
      {/* Icon with glow */}
      <div className={cn(
        'relative w-14 h-14 rounded-xl flex items-center justify-center',
        achievement.tier === 4 ? 'bg-gold/20' : 'bg-primary/20'
      )}>
        <Icon className={cn('w-7 h-7', achievement.color)} />
        {achievement.tier === 4 && (
          <div className="absolute inset-0 rounded-xl animate-pulse bg-gold/10" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-gold" />
          <span className="text-xs font-medium text-gold">
            {t('إنجاز جديد!', 'New Achievement!')}
          </span>
          <span className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-full',
            achievement.tier === 1 && 'bg-emerald-500/20 text-emerald-400',
            achievement.tier === 2 && 'bg-blue-500/20 text-blue-400',
            achievement.tier === 3 && 'bg-purple-500/20 text-purple-400',
            achievement.tier === 4 && 'bg-gold/20 text-gold',
          )}>
            {tierLabels[achievement.tier]}
          </span>
        </div>
        <div className="font-bold text-foreground">
          {t(achievement.name_ar, achievement.name_en)}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {t(achievement.desc_ar, achievement.desc_en)}
        </div>
      </div>
    </div>
  );
}

// Pre-defined achievements
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', tier: 1, icon: Zap, name_ar: 'بداية الرحلة', name_en: 'First Steps', desc_ar: 'أمسك أول بوكيمون', desc_en: 'Catch your first Pokémon', color: 'text-emerald-400' },
  { id: '10', tier: 1, icon: Zap, name_ar: 'جامع مبتدئ', name_en: 'Beginner Collector', desc_ar: 'أمسك 10 بوكيمون', desc_en: 'Catch 10 Pokémon', color: 'text-blue-400' },
  { id: '25', tier: 2, icon: Flame, name_ar: 'صائد نشيط', name_en: 'Active Hunter', desc_ar: 'أمسك 25 بوكيمون', desc_en: 'Catch 25 Pokémon', color: 'text-orange-400' },
  { id: '50', tier: 2, icon: Medal, name_ar: 'جامع متوسط', name_en: 'Intermediate', desc_ar: 'أمسك 50 بوكيمون', desc_en: 'Catch 50 Pokémon', color: 'text-purple-400' },
  { id: '75', tier: 3, icon: Medal, name_ar: 'صائد متمرس', name_en: 'Experienced', desc_ar: 'أمسك 75 بوكيمون', desc_en: 'Catch 75 Pokémon', color: 'text-pink-400' },
  { id: '100', tier: 3, icon: Medal, name_ar: 'جامع خبير', name_en: 'Expert Collector', desc_ar: 'أمسك 100 بوكيمون', desc_en: 'Catch 100 Pokémon', color: 'text-cyan-400' },
  { id: 'all', tier: 4, icon: Crown, name_ar: 'سيد هيسوي', name_en: 'Hisui Master', desc_ar: 'أكمل البوكيدكس', desc_en: 'Complete the Pokédex', color: 'text-gold' },
  { id: 'alpha5', tier: 2, icon: Star, name_ar: 'صائد ألفا', name_en: 'Alpha Hunter', desc_ar: 'أمسك 5 ألفا', desc_en: 'Catch 5 Alpha', color: 'text-red-400' },
  { id: 'alpha15', tier: 3, icon: Star, name_ar: 'سيد ألفا', name_en: 'Alpha Master', desc_ar: 'أمسك 15 ألفا', desc_en: 'Catch 15 Alpha', color: 'text-red-500' },
  { id: 'shiny3', tier: 3, icon: Sparkles, name_ar: 'صائد لامع', name_en: 'Shiny Hunter', desc_ar: 'أمسك 3 لامع', desc_en: 'Catch 3 Shiny', color: 'text-yellow-400' },
  { id: 'shiny10', tier: 4, icon: Sparkles, name_ar: 'سيد اللمعان', name_en: 'Shiny Master', desc_ar: 'أمسك 10 لامع', desc_en: 'Catch 10 Shiny', color: 'text-yellow-500' },
];
