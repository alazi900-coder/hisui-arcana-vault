import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { PokemonImageWithFallback } from '@/components/PokemonImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Plus, X, Shield, Swords, Search, 
  ChevronDown, Sparkles, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Pokemon, PokemonType } from '@/types/pokemon';
import { getDefensiveEffectiveness, getWeaknesses, getResistances } from '@/lib/type-chart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TeamSlot {
  pokemon: Pokemon | null;
}

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-type-normal',
  fire: 'bg-type-fire',
  water: 'bg-type-water',
  electric: 'bg-type-electric',
  grass: 'bg-type-grass',
  ice: 'bg-type-ice',
  fighting: 'bg-type-fighting',
  poison: 'bg-type-poison',
  ground: 'bg-type-ground',
  flying: 'bg-type-flying',
  psychic: 'bg-type-psychic',
  bug: 'bg-type-bug',
  rock: 'bg-type-rock',
  ghost: 'bg-type-ghost',
  dragon: 'bg-type-dragon',
  dark: 'bg-type-dark',
  steel: 'bg-type-steel',
  fairy: 'bg-type-fairy',
};

export default function TeamBuilderPage() {
  const { t, lang } = useLanguage();
  const [team, setTeam] = useState<TeamSlot[]>(
    Array(6).fill(null).map(() => ({ pokemon: null }))
  );
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const allPokemon = useLiveQuery(() => db.pokemon.orderBy('dex_no').toArray());

  const filteredPokemon = allPokemon?.filter(p => {
    if (!searchQuery) return true;
    return (
      p.name_ar.includes(searchQuery) ||
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.dex_no).includes(searchQuery)
    );
  });

  const handleSelectPokemon = (pokemon: Pokemon) => {
    if (selectedSlot === null) return;
    
    const newTeam = [...team];
    newTeam[selectedSlot] = { pokemon };
    setTeam(newTeam);
    setDialogOpen(false);
    setSearchQuery('');
  };

  const handleRemovePokemon = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = { pokemon: null };
    setTeam(newTeam);
  };

  const teamPokemon = team.filter(slot => slot.pokemon !== null).map(slot => slot.pokemon!);

  // Calculate team type coverage
  const getTeamAnalysis = () => {
    if (teamPokemon.length === 0) return null;

    const allTypes: PokemonType[] = teamPokemon.flatMap(p => p.types);
    const uniqueTypes = [...new Set(allTypes)];

    // Calculate weaknesses across team
    const weaknessCount: Record<string, number> = {};
    const resistanceCount: Record<string, number> = {};

    teamPokemon.forEach(p => {
      const weaknesses = getWeaknesses(p.types);
      const resistances = getResistances(p.types);
      
      weaknesses.forEach(w => {
        weaknessCount[w.type] = (weaknessCount[w.type] || 0) + 1;
      });
      
      resistances.forEach(r => {
        resistanceCount[r.type] = (resistanceCount[r.type] || 0) + 1;
      });
    });

    // Find common weaknesses (multiple team members weak to same type)
    const commonWeaknesses = Object.entries(weaknessCount)
      .filter(([_, count]) => count >= 2)
      .map(([type]) => type);

    // Types that the team resists well
    const strongResistances = Object.entries(resistanceCount)
      .filter(([_, count]) => count >= 2)
      .map(([type]) => type);

    return {
      typesCovered: uniqueTypes,
      commonWeaknesses,
      strongResistances,
      teamSize: teamPokemon.length,
    };
  };

  const analysis = getTeamAnalysis();

  return (
    <div className="pb-20 pt-4 min-h-screen">
      <div className="container px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              {t('بناء الفريق', 'Team Builder')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('أنشئ فريقك المثالي من 6 بوكيمونات', 'Build your perfect team of 6 Pokémon')}
            </p>
          </div>
        </div>

        {/* Team Slots */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {team.map((slot, index) => (
            <Dialog 
              key={index} 
              open={dialogOpen && selectedSlot === index}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (open) setSelectedSlot(index);
              }}
            >
              <DialogTrigger asChild>
                <div
                  className={cn(
                    'relative aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer group',
                    slot.pokemon 
                      ? 'border-primary/50 bg-card hover:border-primary' 
                      : 'border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50'
                  )}
                >
                  {slot.pokemon ? (
                    <>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        <PokemonImageWithFallback
                          pokemonId={slot.pokemon.id}
                          pokemonName={slot.pokemon.name_en}
                          className="w-20 h-20 object-contain"
                        />
                        <span className="text-sm font-medium mt-1 text-center line-clamp-1">
                          {lang === 'ar' ? slot.pokemon.name_ar : slot.pokemon.name_en}
                        </span>
                        <div className="flex gap-1 mt-1">
                          {slot.pokemon.types.map(type => (
                            <Badge
                              key={type}
                              className={cn('text-[10px] px-1.5 py-0', TYPE_COLORS[type])}
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePokemon(index);
                        }}
                        className="absolute top-2 end-2 p-1 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Plus className="w-8 h-8" />
                      <span className="text-xs">{t('إضافة', 'Add')}</span>
                    </div>
                  )}
                  <div className="absolute top-2 start-2 text-xs font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-lg max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>
                    {t('اختر بوكيمون', 'Select Pokémon')}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="relative mb-4">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('بحث...', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-9"
                  />
                </div>
                
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-3 gap-2">
                    {filteredPokemon?.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPokemon(p)}
                        className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors flex flex-col items-center"
                      >
                        <PokemonImageWithFallback
                          pokemonId={p.id}
                          pokemonName={p.name_en}
                          className="w-12 h-12 object-contain"
                        />
                        <span className="text-xs mt-1 text-center line-clamp-1">
                          {lang === 'ar' ? p.name_ar : p.name_en}
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Team Analysis */}
        {analysis && analysis.teamSize > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              {t('تحليل الفريق', 'Team Analysis')}
            </h2>

            {/* Types Covered */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-medium">{t('الأنواع المتاحة', 'Types Covered')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.typesCovered.map(type => (
                  <Badge key={type} className={cn('capitalize', TYPE_COLORS[type])}>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {analysis.commonWeaknesses.length > 0 && (
              <div className="glass rounded-xl p-4 border-l-4 border-l-destructive">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="font-medium">
                    {t('نقاط ضعف مشتركة', 'Common Weaknesses')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {t(
                    'أكثر من بوكيمون في فريقك ضعيف ضد هذه الأنواع',
                    'Multiple Pokémon in your team are weak to these types'
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.commonWeaknesses.map(type => (
                    <Badge key={type} variant="destructive" className="capitalize">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {analysis.strongResistances.length > 0 && (
              <div className="glass rounded-xl p-4 border-l-4 border-l-emerald-500">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">
                    {t('مقاومات قوية', 'Strong Resistances')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.strongResistances.map(type => (
                    <Badge key={type} variant="secondary" className="capitalize">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Team Stats Summary */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Swords className="w-4 h-4 text-accent" />
                <span className="font-medium">{t('ملخص الإحصائيات', 'Stats Summary')}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(teamPokemon.reduce((sum, p) => sum + p.stats.atk, 0) / teamPokemon.length)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t('متوسط الهجوم', 'Avg ATK')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(teamPokemon.reduce((sum, p) => sum + p.stats.def, 0) / teamPokemon.length)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t('متوسط الدفاع', 'Avg DEF')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(teamPokemon.reduce((sum, p) => sum + p.stats.spe, 0) / teamPokemon.length)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t('متوسط السرعة', 'Avg SPD')}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!analysis || analysis.teamSize === 0) && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {t('فريقك فارغ', 'Your team is empty')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('اضغط على أي خانة لإضافة بوكيمون', 'Click on any slot to add a Pokémon')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
