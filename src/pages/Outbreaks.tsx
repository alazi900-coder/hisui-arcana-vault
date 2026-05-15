import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/db';
import type { Location, OutbreakEntry, Pokemon, ResearchLevel } from '@/types/pokemon';
import {
  Sparkles,
  Plus,
  Minus,
  X,
  Star,
  Search,
  MapPin,
  Pause,
  Play,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PokemonImageWithFallback } from '@/components/PokemonImage';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  computeShinyOdds,
  encountersForThreshold,
  type ShinyOddsInput,
} from '@/lib/shiny-odds';

const formatPct = (p: number): string => {
  if (p < 0.0001) return `${(p * 100).toFixed(4)}%`;
  if (p < 0.01) return `${(p * 100).toFixed(3)}%`;
  return `${(p * 100).toFixed(2)}%`;
};

export default function Outbreaks() {
  const { t, lang } = useLanguage();
  const outbreaks = useLiveQuery(() => db.outbreaks.orderBy('updatedAt').reverse().toArray(), []);
  const allPokemon = useLiveQuery(() => db.pokemon.orderBy('dex_no').toArray(), []);
  const allLocations = useLiveQuery(() => db.locations.toArray(), []);
  const [open, setOpen] = useState(false);

  const pokemonById = useMemo(() => new Map((allPokemon ?? []).map(p => [p.id, p])), [allPokemon]);
  const locationById = useMemo(() => new Map((allLocations ?? []).map(l => [l.id, l])), [allLocations]);

  return (
    <div className="pb-20 pt-4 min-h-screen">
      <div className="container px-4 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {t('انتشارات الجموع والشاينيس', 'Outbreaks & Shiny')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('تتبع الانتشارات النشطة واحتمالات الشاينيس', 'Track active outbreaks and live shiny odds')}
              </p>
            </div>
          </div>
          <NewOutbreakDialog
            allPokemon={allPokemon ?? []}
            allLocations={allLocations ?? []}
            open={open}
            onOpenChange={setOpen}
          />
        </div>

        {(!outbreaks || outbreaks.length === 0) && (
          <div className="glass rounded-2xl p-8 text-center">
            <Sparkles className="w-10 h-10 mx-auto text-muted-foreground mb-2 opacity-60" />
            <h2 className="font-semibold mb-1">
              {t('لا توجد انتشارات مسجَّلة بعد', 'No outbreaks tracked yet')}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              {t('سجّل انتشاراً نشطاً لمتابعة احتمالات الشاينيس فوراً.', 'Log an active outbreak to see live shiny odds.')}
            </p>
          </div>
        )}

        {outbreaks?.map(outbreak => (
          <OutbreakCard
            key={outbreak.id}
            outbreak={outbreak}
            pokemon={pokemonById.get(outbreak.pokemonId)}
            location={locationById.get(outbreak.locationId)}
            lang={lang}
          />
        ))}

        <ShinyOddsExplainer />
      </div>
    </div>
  );
}

interface NewOutbreakDialogProps {
  allPokemon: Pokemon[];
  allLocations: Location[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NewOutbreakDialog({ allPokemon, allLocations, open, onOpenChange }: NewOutbreakDialogProps) {
  const { t, lang } = useLanguage();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [massive, setMassive] = useState(false);
  const [query, setQuery] = useState('');

  const filteredPokemon = useMemo(() => {
    if (!query) return allPokemon.slice(0, 100);
    const q = query.toLowerCase();
    return allPokemon
      .filter(p => p.name_en.toLowerCase().includes(q) || p.name_ar.includes(query) || String(p.dex_no).includes(query))
      .slice(0, 100);
  }, [allPokemon, query]);

  const reset = () => {
    setPokemon(null);
    setLocation(null);
    setMassive(false);
    setQuery('');
  };

  const onSubmit = async () => {
    if (!pokemon || !location) return;
    const now = Date.now();
    const entry: OutbreakEntry = {
      id: `${pokemon.id}-${location.id}-${now}`,
      pokemonId: pokemon.id,
      locationId: location.id,
      massive,
      count: 0,
      shinyCharm: false,
      research: 'none',
      createdAt: now,
      updatedAt: now,
      active: true,
    };
    await db.outbreaks.put(entry);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 me-2" />
          {t('انتشار جديد', 'New')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('سجّل انتشاراً نشطاً', 'Log an active outbreak')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">{t('البوكيمون', 'Pokémon')}</div>
            <div className="relative mb-2">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('بحث…', 'Search…')}
                className="ps-9"
              />
            </div>
            <ScrollArea className="h-48 rounded-md border border-border/40">
              <div className="grid grid-cols-2 gap-1.5 p-2">
                {filteredPokemon.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPokemon(p)}
                    className={cn(
                      'flex items-center gap-2 p-1.5 rounded-md text-start text-sm transition-colors',
                      pokemon?.id === p.id ? 'bg-primary/20 border border-primary/40' : 'bg-secondary/30 hover:bg-secondary/60',
                    )}
                  >
                    <PokemonImageWithFallback pokemonId={p.id} dexNo={p.dex_no} name={p.name_en} size="sm" />
                    <span className="truncate">{lang === 'ar' ? p.name_ar : p.name_en}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">{t('المنطقة', 'Location')}</div>
            <div className="grid grid-cols-2 gap-1.5">
              {allLocations.map(l => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLocation(l)}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-md text-start text-sm transition-colors',
                    location?.id === l.id ? 'bg-primary/20 border border-primary/40' : 'bg-secondary/30 hover:bg-secondary/60',
                  )}
                >
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate">{lang === 'ar' ? l.name_ar : l.name_en}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={massive}
              onChange={e => setMassive(e.target.checked)}
              className="accent-primary"
            />
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm">{t('انتشار جماعي ضخم (Distortion)', 'Massive Mass Outbreak')}</span>
          </label>

          <Button onClick={onSubmit} disabled={!pokemon || !location} className="w-full">
            {t('احفظ', 'Save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface OutbreakCardProps {
  outbreak: OutbreakEntry;
  pokemon?: Pokemon;
  location?: Location;
  lang: 'ar' | 'en';
}

function OutbreakCard({ outbreak, pokemon, location, lang }: OutbreakCardProps) {
  const { t } = useLanguage();
  if (!pokemon) return null;

  const oddsInput: ShinyOddsInput = {
    outbreakCount: outbreak.count,
    massive: outbreak.massive,
    shinyCharm: outbreak.shinyCharm,
    research: outbreak.research,
  };
  const odds = computeShinyOdds(oddsInput);
  const fiftyPct = encountersForThreshold(odds.rolls, 0.5);
  const ninetyPct = encountersForThreshold(odds.rolls, 0.9);

  const update = (patch: Partial<OutbreakEntry>) => {
    db.outbreaks.update(outbreak.id, { ...patch, updatedAt: Date.now() });
  };

  return (
    <div className={cn('glass rounded-2xl p-4 border', outbreak.active ? 'border-amber-400/30' : 'border-border/30 opacity-60')}>
      <div className="flex items-start gap-3">
        <Link to={`/pokemon/${pokemon.id}`} className="flex-shrink-0">
          <PokemonImageWithFallback pokemonId={pokemon.id} dexNo={pokemon.dex_no} name={pokemon.name_en} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link to={`/pokemon/${pokemon.id}`} className="font-bold truncate hover:text-primary">
              {lang === 'ar' ? pokemon.name_ar : pokemon.name_en}
            </Link>
            <div className="flex items-center gap-1">
              {outbreak.massive && (
                <Badge variant="outline" className="border-amber-400/60 text-amber-400 text-[10px]">
                  <Crown className="w-3 h-3 me-1" /> MMO
                </Badge>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => update({ active: !outbreak.active })}
                title={t(outbreak.active ? 'علِّق' : 'استأنف', outbreak.active ? 'Pause' : 'Resume')}
              >
                {outbreak.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => db.outbreaks.delete(outbreak.id)}
                title={t('احذف', 'Delete')}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          {location && (
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {lang === 'ar' ? location.name_ar : location.name_en}
            </div>
          )}

          <div className="mt-2 flex items-center gap-1.5">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => update({ count: Math.max(0, outbreak.count - 1) })}
              title={t('انقص', 'Decrease')}
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <div className="font-mono font-bold tabular-nums w-12 text-center">{outbreak.count}</div>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => update({ count: outbreak.count + 1 })}
              title={t('زد', 'Increase')}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground ms-2">
              {t('الإمساكات في السلسلة', 'in chain')}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={outbreak.shinyCharm}
                onChange={e => update({ shinyCharm: e.target.checked })}
                className="accent-primary"
              />
              <Star className="w-3.5 h-3.5 text-amber-400" />
              {t('وسام الشاينيس', 'Shiny Charm')}
            </label>
            <label className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{t('البحث', 'Research')}:</span>
              <select
                value={outbreak.research}
                onChange={e => update({ research: e.target.value as ResearchLevel })}
                className="bg-secondary/40 border border-border/40 rounded-md px-1.5 py-0.5"
              >
                <option value="none">{t('—', 'None')}</option>
                <option value="complete">{t('مكتمل (Lv4+)', 'Complete (Lv4+)')}</option>
                <option value="perfect">{t('مثالي (Lv10)', 'Perfect (Lv10)')}</option>
              </select>
            </label>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat label={t('Rolls', 'Rolls')} value={`${odds.rolls}×`} highlight />
            <Stat label={t('احتمال/لقاء', 'Per encounter')} value={formatPct(odds.probability)} />
            <Stat label={t('1 من', '1 in')} value={odds.oneIn.toLocaleString()} />
            <Stat
              label={t('50% بعد', '50% after')}
              value={fiftyPct === Infinity ? '∞' : fiftyPct.toLocaleString()}
            />
          </div>
          <div className="text-[11px] text-muted-foreground mt-1.5">
            {t('90% بعد', '90% after')}: {ninetyPct === Infinity ? '∞' : ninetyPct.toLocaleString()} {t('لقاء', 'encounters')}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn(
      'rounded-lg px-2 py-1.5 border text-center',
      highlight ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'bg-secondary/30 border-border/30',
    )}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono font-semibold text-sm tabular-nums">{value}</div>
    </div>
  );
}

function ShinyOddsExplainer() {
  const { t } = useLanguage();
  return (
    <details className="glass rounded-2xl p-4 group">
      <summary className="cursor-pointer text-sm font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        {t('كيف تُحسب الاحتمالات؟', 'How are the odds calculated?')}
      </summary>
      <div className="text-xs text-muted-foreground mt-3 space-y-1 leading-relaxed">
        <p>{t(
          'القاعدة في PLA: لكل لقاء عدد من "Rolls"، كلٌّ بمعدل أساسي ١/٤٠٩٦.',
          'In PLA each encounter performs a number of "rolls", each at the base 1/4096 rate.',
        )}</p>
        <ul className="list-disc list-inside space-y-0.5 ps-2">
          <li>+1 roll {t('سلسلة 13+', 'chain ≥ 13')}</li>
          <li>+2 rolls {t('سلسلة 20+', 'chain ≥ 20')}</li>
          <li>+3 rolls {t('سلسلة 25+', 'chain ≥ 25')}</li>
          <li>+4 rolls {t('سلسلة 30+', 'chain ≥ 30')}</li>
          <li>+5 rolls {t('سلسلة 60+', 'chain ≥ 60')}</li>
          <li>+1 roll {t('بحث مثالي', 'Perfect research (Lv10)')}</li>
          <li>+2 rolls {t('وسام الشاينيس', 'Shiny Charm')}</li>
          <li>+25 rolls {t('انتشار جماعي ضخم (سلسلة 25+)', 'Massive Mass Outbreak (chain ≥ 25)')}</li>
        </ul>
        <p className="pt-1">
          {t(
            'الاحتمال النهائي = 1 − (1 − 1/4096) أُس عدد الـ rolls.',
            'Final probability = 1 − (1 − 1/4096) ^ rolls.',
          )}
        </p>
      </div>
    </details>
  );
}
