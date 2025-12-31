import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { PokemonImageWithFallback } from '@/components/PokemonImage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, Circle, Trophy, Target, 
  Filter, Search, Sparkles, Medal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Pokemon } from '@/types/pokemon';

// Storage key for caught Pokémon
const CAUGHT_STORAGE_KEY = 'pla-dex-caught';

export default function TrackerPage() {
  const { t, lang } = useLanguage();
  const [caught, setCaught] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'caught' | 'uncaught'>('all');
  const [search, setSearch] = useState('');

  const allPokemon = useLiveQuery(() => db.pokemon.orderBy('dex_no').toArray());

  // Load caught from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CAUGHT_STORAGE_KEY);
    if (saved) {
      try {
        setCaught(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load caught data:', e);
      }
    }
  }, []);

  // Save caught to localStorage
  const saveCaught = (newCaught: Set<string>) => {
    localStorage.setItem(CAUGHT_STORAGE_KEY, JSON.stringify([...newCaught]));
    setCaught(newCaught);
  };

  const toggleCaught = (id: string) => {
    const newCaught = new Set(caught);
    if (newCaught.has(id)) {
      newCaught.delete(id);
      toast.success(t('تم إلغاء التحديد', 'Unmarked'));
    } else {
      newCaught.add(id);
      toast.success(t('تم التحديد كمُمسك!', 'Marked as caught!'));
    }
    saveCaught(newCaught);
  };

  const filteredPokemon = allPokemon?.filter(p => {
    const matchesSearch = !search || 
      p.name_ar.includes(search) || 
      p.name_en.toLowerCase().includes(search.toLowerCase()) ||
      String(p.dex_no).includes(search);

    const matchesFilter = 
      filter === 'all' ||
      (filter === 'caught' && caught.has(p.id)) ||
      (filter === 'uncaught' && !caught.has(p.id));

    return matchesSearch && matchesFilter;
  });

  const totalCount = allPokemon?.length || 0;
  const caughtCount = caught.size;
  const progressPercent = totalCount > 0 ? (caughtCount / totalCount) * 100 : 0;

  // Achievements
  const achievements = [
    { id: 'first', name: t('بداية الرحلة', 'First Steps'), desc: t('أمسك أول بوكيمون', 'Catch your first Pokémon'), unlocked: caughtCount >= 1 },
    { id: '10', name: t('جامع مبتدئ', 'Beginner Collector'), desc: t('أمسك 10 بوكيمونات', 'Catch 10 Pokémon'), unlocked: caughtCount >= 10 },
    { id: '50', name: t('جامع متوسط', 'Intermediate Collector'), desc: t('أمسك 50 بوكيمون', 'Catch 50 Pokémon'), unlocked: caughtCount >= 50 },
    { id: '100', name: t('جامع خبير', 'Expert Collector'), desc: t('أمسك 100 بوكيمون', 'Catch 100 Pokémon'), unlocked: caughtCount >= 100 },
    { id: 'all', name: t('سيد هيسوي', 'Hisui Master'), desc: t('أكمل الـ Pokédex', 'Complete the Pokédex'), unlocked: caughtCount >= totalCount && totalCount > 0 },
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
            <h1 className="text-2xl font-bold text-gradient">
              {t('متتبع الـ Pokédex', 'Pokédex Tracker')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('تتبع تقدمك في جمع البوكيمونات', 'Track your Pokémon collection progress')}
            </p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className={cn(
                'w-8 h-8',
                progressPercent >= 100 ? 'text-gold' : 'text-muted-foreground'
              )} />
              <div>
                <div className="text-2xl font-bold">
                  {caughtCount} / {totalCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('بوكيمون مُمسك', 'Pokémon caught')}
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-primary">
              {progressPercent.toFixed(1)}%
            </div>
          </div>
          
          <Progress value={progressPercent} className="h-3" />
          
          {progressPercent >= 100 && (
            <div className="mt-4 text-center animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full text-gold">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold">{t('تهانينا! أكملت الـ Pokédex!', 'Congratulations! Pokédex Complete!')}</span>
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Medal className="w-5 h-5 text-gold" />
            {t('الإنجازات', 'Achievements')}
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {achievements.map(ach => (
              <div
                key={ach.id}
                className={cn(
                  'shrink-0 px-4 py-3 rounded-xl border transition-all',
                  ach.unlocked
                    ? 'bg-gold/10 border-gold/30 glow-gold'
                    : 'bg-secondary/30 border-border/30 opacity-50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-gold" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={cn('font-medium text-sm', ach.unlocked && 'text-gold')}>
                    {ach.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('بحث...', 'Search...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ps-9 bg-secondary/50"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            {t('الكل', 'All')} ({totalCount})
          </Button>
          <Button
            variant={filter === 'caught' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('caught')}
            className={filter === 'caught' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
          >
            <CheckCircle2 className="w-3 h-3 me-1" />
            {t('مُمسك', 'Caught')} ({caughtCount})
          </Button>
          <Button
            variant={filter === 'uncaught' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('uncaught')}
          >
            <Circle className="w-3 h-3 me-1" />
            {t('غير مُمسك', 'Uncaught')} ({totalCount - caughtCount})
          </Button>
        </div>

        {/* Pokemon Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {filteredPokemon?.map((p, i) => {
            const isCaught = caught.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleCaught(p.id)}
                className={cn(
                  'relative rounded-xl p-2 transition-all animate-fade-in-up',
                  isCaught
                    ? 'bg-emerald-900/30 border border-emerald-500/30'
                    : 'bg-secondary/30 border border-border/30 hover:bg-secondary/50'
                )}
                style={{ animationDelay: `${Math.min(i, 20) * 20}ms` }}
              >
                <div className={cn('transition-all', !isCaught && 'grayscale opacity-50')}>
                  <PokemonImageWithFallback
                    pokemonId={p.id}
                    pokemonName={p.name_en}
                    className="w-full aspect-square object-contain"
                  />
                </div>
                
                <div className="text-[10px] font-medium text-center mt-1 line-clamp-1">
                  #{p.dex_no}
                </div>
                
                {isCaught && (
                  <div className="absolute top-1 end-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {filteredPokemon?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('لا توجد نتائج', 'No results found')}
          </div>
        )}
      </div>
    </div>
  );
}
