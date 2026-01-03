import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLivingDexStats, useLivingDexRecent, useLivingDexAll, exportLivingDexData, clearLivingDexData } from '@/hooks/use-living-dex';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Target, CheckCircle2, Star, Sparkles, 
  Download, Trash2, Clock, Medal, AlertTriangle,
  TrendingUp, Flame, Crown, Zap, CircleDot,
  Filter, BarChart3, PieChart, Calendar
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
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function TrackerPage() {
  const { t, lang } = useLanguage();
  const stats = useLivingDexStats();
  const recentActivity = useLivingDexRecent(15);
  const allEntries = useLivingDexAll();
  const [activeTab, setActiveTab] = useState('overview');

  // Get Pokemon by type for chart
  const pokemonByType = useLiveQuery(async () => {
    const pokemon = await db.pokemon.toArray();
    const entries = await db.livingDex.toArray();
    const caughtIds = new Set(entries.filter(e => e.caught).map(e => e.pokemon_id));
    
    const typeStats: Record<string, { total: number; caught: number }> = {};
    
    pokemon.forEach(p => {
      const type = p.types[0];
      if (!typeStats[type]) {
        typeStats[type] = { total: 0, caught: 0 };
      }
      typeStats[type].total++;
      if (caughtIds.has(p.id)) {
        typeStats[type].caught++;
      }
    });
    
    return Object.entries(typeStats).map(([name, data]) => ({
      name,
      total: data.total,
      caught: data.caught,
      percentage: Math.round((data.caught / data.total) * 100)
    })).sort((a, b) => b.total - a.total);
  });

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

  // Enhanced achievements with tiers
  const achievements = [
    { id: 'first', tier: 1, icon: CircleDot, name: t('بداية الرحلة', 'First Steps'), desc: t('أمسك أول بوكيمون', 'Catch your first'), unlocked: (stats?.caught ?? 0) >= 1, color: 'text-emerald-400' },
    { id: '10', tier: 1, icon: Zap, name: t('جامع مبتدئ', 'Beginner'), desc: t('أمسك 10', 'Catch 10'), unlocked: (stats?.caught ?? 0) >= 10, color: 'text-blue-400' },
    { id: '25', tier: 2, icon: Flame, name: t('صائد نشيط', 'Active Hunter'), desc: t('أمسك 25', 'Catch 25'), unlocked: (stats?.caught ?? 0) >= 25, color: 'text-orange-400' },
    { id: '50', tier: 2, icon: Target, name: t('جامع متوسط', 'Intermediate'), desc: t('أمسك 50', 'Catch 50'), unlocked: (stats?.caught ?? 0) >= 50, color: 'text-purple-400' },
    { id: '75', tier: 3, icon: TrendingUp, name: t('صائد متمرس', 'Experienced'), desc: t('أمسك 75', 'Catch 75'), unlocked: (stats?.caught ?? 0) >= 75, color: 'text-pink-400' },
    { id: '100', tier: 3, icon: Medal, name: t('جامع خبير', 'Expert'), desc: t('أمسك 100', 'Catch 100'), unlocked: (stats?.caught ?? 0) >= 100, color: 'text-cyan-400' },
    { id: 'all', tier: 4, icon: Crown, name: t('سيد هيسوي', 'Hisui Master'), desc: t('أكمل الـ Pokédex', 'Complete Dex'), unlocked: (stats?.caught ?? 0) >= (stats?.totalPokemon ?? 1) && (stats?.totalPokemon ?? 0) > 0, color: 'text-gold' },
    { id: 'alpha5', tier: 2, icon: Star, name: t('صائد ألفا', 'Alpha Hunter'), desc: t('أمسك 5 ألفا', 'Catch 5 Alpha'), unlocked: (stats?.alpha ?? 0) >= 5, color: 'text-red-400' },
    { id: 'alpha15', tier: 3, icon: Star, name: t('سيد ألفا', 'Alpha Master'), desc: t('أمسك 15 ألفا', 'Catch 15 Alpha'), unlocked: (stats?.alpha ?? 0) >= 15, color: 'text-red-500' },
    { id: 'shiny3', tier: 3, icon: Sparkles, name: t('صائد لامع', 'Shiny Hunter'), desc: t('أمسك 3 لامع', 'Catch 3 Shiny'), unlocked: (stats?.shiny ?? 0) >= 3, color: 'text-yellow-400' },
    { id: 'shiny10', tier: 4, icon: Sparkles, name: t('سيد اللمعان', 'Shiny Master'), desc: t('أمسك 10 لامع', 'Catch 10 Shiny'), unlocked: (stats?.shiny ?? 0) >= 10, color: 'text-yellow-500' },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  // Pie chart data
  const pieData = [
    { name: t('مُمسك', 'Caught'), value: stats?.caught ?? 0, color: 'hsl(var(--primary))' },
    { name: t('غير مُمسك', 'Not Caught'), value: (stats?.totalPokemon ?? 0) - (stats?.caught ?? 0), color: 'hsl(var(--muted))' },
  ];

  // Calculate streaks and milestones
  const nextMilestone = [10, 25, 50, 75, 100, stats?.totalPokemon ?? 242].find(m => m > (stats?.caught ?? 0)) ?? (stats?.totalPokemon ?? 242);
  const progressToNext = stats?.caught ?? 0;
  const remaining = nextMilestone - progressToNext;

  return (
    <div className="pb-20 pt-4 min-h-screen">
      <div className="container px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-gold/20 to-accent/20 shadow-lg">
              <Target className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">{t('المتتبع', 'Tracker')}</h1>
              <p className="text-sm text-muted-foreground">{t('تتبع Living Dex', 'Living Dex Progress')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center px-3 py-1 rounded-lg bg-gold/10 border border-gold/20">
              <div className="text-xs text-muted-foreground">{t('إنجازات', 'Badges')}</div>
              <div className="font-bold text-gold">{unlockedCount}/{achievements.length}</div>
            </div>
          </div>
        </div>

        {/* Main Stats Card */}
        <div className="glass rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-gold/5 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-16 h-16 rounded-xl flex items-center justify-center',
                  (stats?.percentage ?? 0) >= 100 
                    ? 'bg-gradient-to-br from-gold/30 to-yellow-500/30' 
                    : 'bg-gradient-to-br from-primary/20 to-accent/20'
                )}>
                  <Trophy className={cn('w-8 h-8', (stats?.percentage ?? 0) >= 100 ? 'text-gold' : 'text-primary')} />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats?.caught ?? 0} <span className="text-muted-foreground text-lg">/ {stats?.totalPokemon ?? 0}</span></div>
                  <div className="text-sm text-muted-foreground">{t('بوكيمون مُمسك', 'Pokémon caught')}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gradient">{(stats?.percentage ?? 0).toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">{t('نسبة الإكمال', 'Completion')}</div>
              </div>
            </div>
            <Progress value={stats?.percentage ?? 0} className="h-4 mb-3" />
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

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-xl p-4 text-center relative overflow-hidden group hover:scale-105 transition-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CheckCircle2 className="w-7 h-7 mx-auto mb-2 text-emerald-400" />
            <div className="text-2xl font-bold">{stats?.caught ?? 0}</div>
            <div className="text-xs text-muted-foreground">{t('مُمسك', 'Caught')}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center relative overflow-hidden group hover:scale-105 transition-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Star className="w-7 h-7 mx-auto mb-2 text-red-400 fill-red-400" />
            <div className="text-2xl font-bold">{stats?.alpha ?? 0}</div>
            <div className="text-xs text-muted-foreground">{t('ألفا', 'Alpha')}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center relative overflow-hidden group hover:scale-105 transition-transform">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-7 h-7 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">{stats?.shiny ?? 0}</div>
            <div className="text-xs text-muted-foreground">{t('لامع', 'Shiny')}</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('نظرة عامة', 'Overview')}
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Medal className="w-4 h-4" />
              {t('الإنجازات', 'Badges')}
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Clock className="w-4 h-4" />
              {t('النشاط', 'Activity')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Pie Chart */}
            <div className="glass rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                {t('نسبة الإكمال', 'Completion Rate')}
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">{t('مُمسك', 'Caught')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <span className="text-sm">{t('غير مُمسك', 'Not Caught')}</span>
                </div>
              </div>
            </div>

            {/* Type Progress Bar Chart */}
            {pokemonByType && pokemonByType.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  {t('التقدم حسب النوع', 'Progress by Type')}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pokemonByType.slice(0, 8)} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number, name: string) => [value, name === 'caught' ? t('مُمسك', 'Caught') : t('إجمالي', 'Total')]}
                      />
                      <Bar dataKey="total" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="caught" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold" />
                  {t('الإنجازات', 'Achievements')}
                </h3>
                <span className="text-sm text-muted-foreground">{unlockedCount}/{achievements.length} {t('مفتوح', 'unlocked')}</span>
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
                      <div className={cn('font-medium text-sm mb-0.5', ach.unlocked && 'text-gold')}>{ach.name}</div>
                      <p className="text-xs text-muted-foreground">{ach.desc}</p>
                      <div className="mt-2">
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-full',
                          ach.tier === 1 && 'bg-emerald-500/20 text-emerald-400',
                          ach.tier === 2 && 'bg-blue-500/20 text-blue-400',
                          ach.tier === 3 && 'bg-purple-500/20 text-purple-400',
                          ach.tier === 4 && 'bg-gold/20 text-gold',
                        )}>
                          {ach.tier === 1 && (t('برونزي', 'Bronze'))}
                          {ach.tier === 2 && (t('فضي', 'Silver'))}
                          {ach.tier === 3 && (t('ذهبي', 'Gold'))}
                          {ach.tier === 4 && (t('أسطوري', 'Legendary'))}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="glass rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t('النشاط الأخير', 'Recent Activity')}
              </h3>
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {recentActivity.map((item) => (
                    <Link 
                      key={item.pokemon_id} 
                      to={`/pokemon/${item.pokemon_id}`} 
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all group"
                    >
                      <div className="relative">
                        <PokemonImageWithFallback pokemonId={item.pokemon_id} pokemonName={item.pokemon?.name_en || ''} className="w-12 h-12" />
                        {item.shiny && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate group-hover:text-primary transition-colors">
                          {t(item.pokemon?.name_ar || '', item.pokemon?.name_en || '')}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>#{item.pokemon?.dex_no}</span>
                          <span>•</span>
                          <span>{new Date(item.updated_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {item.caught && (
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                        )}
                        {item.alpha && (
                          <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-red-400 fill-red-400" />
                          </div>
                        )}
                        {item.shiny && (
                          <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">{t('لا يوجد نشاط بعد', 'No activity yet')}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('ابدأ بتسجيل بوكيمون من صفحة البوكيمون', 'Start tracking from the Pokémon page')}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleExport} variant="outline" className="flex-1 h-12">
            <Download className="w-4 h-4 me-2" />
            {t('تصدير', 'Export')}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1 h-12">
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
