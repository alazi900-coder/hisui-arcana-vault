import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2, Star, Sparkles } from 'lucide-react';

interface QuickStatsProps {
  caught: number;
  alpha: number;
  shiny: number;
}

export function QuickStats({ caught, alpha, shiny }: QuickStatsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="glass rounded-xl p-4 text-center relative overflow-hidden group hover:scale-105 transition-transform">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CheckCircle2 className="w-7 h-7 mx-auto mb-2 text-emerald-400" />
        <div className="text-2xl font-bold">{caught}</div>
        <div className="text-xs text-muted-foreground">{t('مُمسك', 'Caught')}</div>
      </div>
      <div className="glass rounded-xl p-4 text-center relative overflow-hidden group hover:scale-105 transition-transform">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Star className="w-7 h-7 mx-auto mb-2 text-red-400 fill-red-400" />
        <div className="text-2xl font-bold">{alpha}</div>
        <div className="text-xs text-muted-foreground">{t('ألفا', 'Alpha')}</div>
      </div>
      <div className="glass rounded-xl p-4 text-center relative overflow-hidden group hover:scale-105 transition-transform">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className="w-7 h-7 mx-auto mb-2 text-yellow-400" />
        <div className="text-2xl font-bold">{shiny}</div>
        <div className="text-xs text-muted-foreground">{t('لامع', 'Shiny')}</div>
      </div>
    </div>
  );
}
