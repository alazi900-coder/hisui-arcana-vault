import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLivingDexStats, useLivingDexRecent, exportLivingDexData, clearLivingDexData } from '@/hooks/use-living-dex';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Target, CheckCircle2, Star, Sparkles, 
  Download, Trash2, Clock, Medal, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { PokemonImageWithFallback } from '@/components/PokemonImage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TrackerPage() {
  const { t } = useLanguage();
  const stats = useLivingDexStats();
  const recentActivity = useLivingDexRecent(10);

  const handleExport = async () => {
    try {
      const data = await exportLivingDexData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pla-living-dex-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('تم تصدير البيانات بنجاح', 'Progress exported successfully'));
    } catch (error) {
      toast.error(t('فشل تصدير البيانات', 'Failed to export progress'));
    }
  };

  const handleReset = async () => {
    try {
      await clearLivingDexData();
      toast.success(t('تم إعادة تعيين التقدم', 'Progress reset successfully'));
    } catch (error) {
      toast.error(t('فشل إعادة التعيين', 'Failed to reset progress'));
    }
  };

  const achievements = [
    { id: 'first', name: t('بداية الرحلة', 'First Steps'), desc: t('أمسك أول بوكيمون', 'Catch your first'), unlocked: (stats?.caught ?? 0) >= 1 },
    { id: '10', name: t('جامع مبتدئ', 'Beginner'), desc: t('أمسك 10', 'Catch 10'), unlocked: (stats?.caught ?? 0) >= 10 },
    { id: '50', name: t('جامع متوسط', 'Intermediate'), desc: t('أمسك 50', 'Catch 50'), unlocked: (stats?.caught ?? 0) >= 50 },
    { id: '100', name: t('جامع خبير', 'Expert'), desc: t('أمسك 100', 'Catch 100'), unlocked: (stats?.caught ?? 0) >= 100 },
    { id: 'all', name: t('سيد هيسوي', 'Hisui Master'), desc: t('أكمل الـ Pokédex', 'Complete Dex'), unlocked: (stats?.caught ?? 0) >= (stats?.totalPokemon ?? 1) && (stats?.totalPokemon ?? 0) > 0 },
  ];

  return (
    <div className="pb-20 pt-4 min-h-screen">
      <div className="container px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-gold/20 to-accent/20">
            <Target className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">{t('المتتبع', 'Tracker')}</h1>
            <p className="text-sm text-muted-foreground">{t('تتبع Living Dex', 'Living Dex Progress')}</p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className={cn('w-8 h-8', (stats?.percentage ?? 0) >= 100 ? 'text-gold' : 'text-muted-foreground')} />
              <div>
                <div className="text-2xl font-bold">{stats?.caught ?? 0} / {stats?.totalPokemon ?? 0}</div>
                <div className="text-sm text-muted-foreground">{t('بوكيمون مُمسك', 'Pokémon caught')}</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-primary">{(stats?.percentage ?? 0).toFixed(1)}%</div>
          </div>
          <Progress value={stats?.percentage ?? 0} className="h-3" />
        </div>

        {/* Counters */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-xl p-4 text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
            <div className="text-2xl font-bold">{stats?.caught ?? 0}</div>
            <div className="text-xs text-muted-foreground">{t('مُمسك', 'Caught')}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-red-400 fill-red-400" />
            <div className="text-2xl font-bold">{stats?.alpha ?? 0}</div>
            <div className="text-xs text-muted-foreground">{t('ألفا', 'Alpha')}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">{stats?.shiny ?? 0}</div>
            <div className="text-xs text-muted-foreground">{t('لامع', 'Shiny')}</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Medal className="w-5 h-5 text-gold" />
            {t('الإنجازات', 'Achievements')}
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {achievements.map(ach => (
              <div key={ach.id} className={cn(
                'shrink-0 px-4 py-3 rounded-xl border transition-all',
                ach.unlocked ? 'bg-gold/10 border-gold/30' : 'bg-secondary/30 border-border/30 opacity-50'
              )}>
                <div className="flex items-center gap-2 mb-1">
                  {ach.unlocked ? <CheckCircle2 className="w-4 h-4 text-gold" /> : <div className="w-4 h-4 rounded-full border border-muted-foreground" />}
                  <span className={cn('font-medium text-sm', ach.unlocked && 'text-gold')}>{ach.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t('النشاط الأخير', 'Recent Activity')}
          </h2>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.map((item) => (
                <Link key={item.pokemon_id} to={`/pokemon/${item.pokemon_id}`} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all">
                  <PokemonImageWithFallback pokemonId={item.pokemon_id} pokemonName={item.pokemon?.name_en || ''} className="w-10 h-10" />
                  <div className="flex-1">
                    <div className="font-medium">{t(item.pokemon?.name_ar || '', item.pokemon?.name_en || '')}</div>
                    <div className="text-xs text-muted-foreground">#{item.pokemon?.dex_no}</div>
                  </div>
                  <div className="flex gap-1">
                    {item.caught && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {item.alpha && <Star className="w-4 h-4 text-red-400 fill-red-400" />}
                    {item.shiny && <Sparkles className="w-4 h-4 text-yellow-400" />}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">{t('لا يوجد نشاط بعد', 'No activity yet')}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleExport} variant="outline" className="flex-1">
            <Download className="w-4 h-4 me-2" />
            {t('تصدير التقدم', 'Export Progress')}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                <Trash2 className="w-4 h-4 me-2" />
                {t('إعادة تعيين', 'Reset')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  {t('تأكيد إعادة التعيين', 'Confirm Reset')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('سيتم حذف جميع بيانات التتبع. هذا الإجراء لا يمكن التراجع عنه.', 'All tracking data will be deleted. This action cannot be undone.')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('إلغاء', 'Cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                  {t('إعادة تعيين', 'Reset')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
