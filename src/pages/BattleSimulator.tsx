import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/db';
import type { Move, Pokemon } from '@/types/pokemon';
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
import { Gamepad2, Search, RotateCcw, Trophy, Skull, Sparkles, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import { executeTurn, newBattle } from '@/lib/battle/engine';
import type { BattleState } from '@/lib/battle/types';

interface SideConfig {
  pokemon: Pokemon | null;
  level: number;
  moveIds: string[];
}

const initialSide = (): SideConfig => ({ pokemon: null, level: 50, moveIds: [] });

function pickAiMoveIds(pokemon: Pokemon, allMoves: Move[]): string[] {
  const damaging = pokemon.learnset
    .filter(l => {
      const m = allMoves.find(mv => mv.id === l.move_id);
      return m && m.category !== 'status' && (m.power ?? 0) > 0;
    })
    .slice(0, 4)
    .map(l => l.move_id);
  if (damaging.length > 0) return damaging;
  return pokemon.learnset.slice(0, 4).map(l => l.move_id);
}

export default function BattleSimulator() {
  const { t, lang } = useLanguage();
  const allPokemon = useLiveQuery(() => db.pokemon.orderBy('dex_no').toArray(), []);
  const allMoves = useLiveQuery(() => db.moves.toArray(), []);

  const [player, setPlayer] = useState<SideConfig>(initialSide);
  const [opponent, setOpponent] = useState<SideConfig>(initialSide);
  const [battle, setBattle] = useState<BattleState | null>(null);

  // Whenever a side picks a Pokémon and has no moves yet, auto-pick its first 4 damaging moves.
  useEffect(() => {
    if (!allMoves) return;
    if (player.pokemon && player.moveIds.length === 0) {
      setPlayer(prev => ({ ...prev, moveIds: pickAiMoveIds(player.pokemon!, allMoves) }));
    }
  }, [player.pokemon, allMoves, player.moveIds.length]);

  useEffect(() => {
    if (!allMoves) return;
    if (opponent.pokemon && opponent.moveIds.length === 0) {
      setOpponent(prev => ({ ...prev, moveIds: pickAiMoveIds(opponent.pokemon!, allMoves) }));
    }
  }, [opponent.pokemon, allMoves, opponent.moveIds.length]);

  const playerMoves = useMemo<Move[]>(() => {
    if (!allMoves || !player.pokemon) return [];
    return player.moveIds.map(id => allMoves.find(m => m.id === id)).filter((m): m is Move => Boolean(m));
  }, [allMoves, player.moveIds, player.pokemon]);

  const opponentMoves = useMemo<Move[]>(() => {
    if (!allMoves || !opponent.pokemon) return [];
    return opponent.moveIds.map(id => allMoves.find(m => m.id === id)).filter((m): m is Move => Boolean(m));
  }, [allMoves, opponent.moveIds, opponent.pokemon]);

  const canStart = Boolean(
    player.pokemon && opponent.pokemon && playerMoves.length > 0 && opponentMoves.length > 0,
  );

  const handleStart = () => {
    if (!player.pokemon || !opponent.pokemon) return;
    setBattle(
      newBattle({
        player: { pokemon: player.pokemon, level: player.level, movesetIds: player.moveIds },
        opponent: { pokemon: opponent.pokemon, level: opponent.level, movesetIds: opponent.moveIds },
      }),
    );
  };

  const handleReset = () => setBattle(null);

  const handlePlayerMove = (move: Move) => {
    if (!battle || battle.outcome !== 'ongoing' || opponentMoves.length === 0) return;
    const aiMove = opponentMoves[Math.floor(Math.random() * opponentMoves.length)];
    setBattle(executeTurn(battle, { playerMove: move, opponentMove: aiMove }));
  };

  return (
    <div className="pb-20 pt-4 min-h-screen">
      <div className="container px-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-type-fighting/20 to-destructive/20">
            <Gamepad2 className="w-6 h-6 text-type-fighting" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              {t('محاكي المعركة', 'Battle Simulator')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('قتال 1 ضد 1 محاكي بالكامل', 'Full 1v1 turn-based simulation')}
            </p>
          </div>
        </div>

        {!battle ? (
          <Setup
            player={player}
            opponent={opponent}
            onPlayerChange={setPlayer}
            onOpponentChange={setOpponent}
            allPokemon={allPokemon ?? []}
            allMoves={allMoves ?? []}
            canStart={canStart}
            onStart={handleStart}
          />
        ) : (
          <Arena
            battle={battle}
            playerMoves={playerMoves}
            onPlayerMove={handlePlayerMove}
            onReset={handleReset}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
}

interface SetupProps {
  player: SideConfig;
  opponent: SideConfig;
  onPlayerChange: (s: SideConfig) => void;
  onOpponentChange: (s: SideConfig) => void;
  allPokemon: Pokemon[];
  allMoves: Move[];
  canStart: boolean;
  onStart: () => void;
}

function Setup({ player, opponent, onPlayerChange, onOpponentChange, allPokemon, allMoves, canStart, onStart }: SetupProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <SideCard
          title={t('فريقك', 'Your side')}
          accent="bg-primary/10 border-primary/30 text-primary"
          config={player}
          onChange={onPlayerChange}
          allPokemon={allPokemon}
          allMoves={allMoves}
        />
        <SideCard
          title={t('الخصم', 'Opponent')}
          accent="bg-destructive/10 border-destructive/30 text-destructive"
          config={opponent}
          onChange={onOpponentChange}
          allPokemon={allPokemon}
          allMoves={allMoves}
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!canStart}
        onClick={onStart}
      >
        <Swords className="w-5 h-5 me-2" />
        {t('ابدأ المعركة', 'Start Battle')}
      </Button>
    </div>
  );
}

interface SideCardProps {
  title: string;
  accent: string;
  config: SideConfig;
  onChange: (s: SideConfig) => void;
  allPokemon: Pokemon[];
  allMoves: Move[];
}

function SideCard({ title, accent, config, onChange, allPokemon, allMoves }: SideCardProps) {
  const { t } = useLanguage();
  const movesForPokemon = useMemo<Move[]>(() => {
    if (!config.pokemon) return [];
    const ids = new Set(config.pokemon.learnset.map(l => l.move_id));
    return allMoves.filter(m => ids.has(m.id));
  }, [config.pokemon, allMoves]);

  const toggleMove = (id: string) => {
    const has = config.moveIds.includes(id);
    if (has) {
      onChange({ ...config, moveIds: config.moveIds.filter(m => m !== id) });
    } else if (config.moveIds.length < 4) {
      onChange({ ...config, moveIds: [...config.moveIds, id] });
    }
  };

  return (
    <div className={cn('glass rounded-2xl p-4 border', accent)}>
      <h2 className="font-bold mb-3 flex items-center justify-between">
        <span>{title}</span>
        {config.pokemon && (
          <span className="text-xs font-normal text-muted-foreground">
            #{String(config.pokemon.dex_no).padStart(3, '0')}
          </span>
        )}
      </h2>

      <PokemonPicker
        selected={config.pokemon}
        onSelect={p => onChange({ pokemon: p, level: config.level, moveIds: [] })}
        allPokemon={allPokemon}
      />

      {config.pokemon && (
        <>
          <div className="mt-3">
            <label className="text-xs text-muted-foreground block mb-1">
              {t('المستوى', 'Level')}: <span className="font-bold text-foreground">{config.level}</span>
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={config.level}
              onChange={e => onChange({ ...config, level: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
              <span>{t('الحركات', 'Moves')}</span>
              <span>{config.moveIds.length}/4</span>
            </div>
            <ScrollArea className="h-40 rounded-md border border-border/40 p-2">
              <div className="flex flex-wrap gap-1.5">
                {movesForPokemon.length === 0 ? (
                  <span className="text-xs text-muted-foreground p-2">
                    {t('لا توجد حركات', 'No moves')}
                  </span>
                ) : (
                  movesForPokemon.map(m => {
                    const picked = config.moveIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMove(m.id)}
                        className={cn(
                          'px-2 py-1 rounded-full text-xs border transition-colors',
                          picked
                            ? 'bg-primary/30 border-primary/60 text-primary'
                            : 'bg-secondary/40 border-border/40 hover:bg-secondary/70',
                        )}
                      >
                        {t(m.name_ar, m.name_en)}
                        {m.power ? <span className="ms-1 opacity-60">{m.power}</span> : null}
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}

interface PokemonPickerProps {
  selected: Pokemon | null;
  onSelect: (p: Pokemon) => void;
  allPokemon: Pokemon[];
}

function PokemonPicker({ selected, onSelect, allPokemon }: PokemonPickerProps) {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return allPokemon.slice(0, 100);
    const q = query.toLowerCase();
    return allPokemon.filter(p => p.name_en.toLowerCase().includes(q) || p.name_ar.includes(query) || String(p.dex_no).includes(query)).slice(0, 100);
  }, [allPokemon, query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-secondary/30 hover:bg-secondary/50 transition-colors text-start"
        >
          {selected ? (
            <>
              <PokemonImageWithFallback
                pokemonId={selected.id}
                dexNo={selected.dex_no}
                name={selected.name_en}
                size="sm"
              />
              <div>
                <div className="font-medium">{t(selected.name_ar, selected.name_en)}</div>
                <div className="flex gap-1 mt-0.5">
                  {selected.types.map(type => (
                    <span
                      key={type}
                      className="px-1.5 py-0.5 text-[10px] font-medium rounded-full capitalize text-white"
                      style={{ backgroundColor: `hsl(var(--type-${type}))` }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">{t('اختر بوكيمون…', 'Choose a Pokémon…')}</span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('اختر بوكيمون', 'Pick a Pokémon')}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('بحث بالاسم أو الرقم', 'Search by name or number')}
            className="ps-9"
          />
        </div>
        <ScrollArea className="h-[55vh]">
          <div className="grid grid-cols-2 gap-2 pe-2">
            {filtered.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelect(p);
                  setOpen(false);
                  setQuery('');
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 text-start"
              >
                <PokemonImageWithFallback pokemonId={p.id} dexNo={p.dex_no} name={p.name_en} size="sm" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">#{String(p.dex_no).padStart(3, '0')}</div>
                  <div className="text-sm font-medium truncate">{lang === 'ar' ? p.name_ar : p.name_en}</div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface ArenaProps {
  battle: BattleState;
  playerMoves: Move[];
  onPlayerMove: (m: Move) => void;
  onReset: () => void;
  lang: 'ar' | 'en';
}

function Arena({ battle, playerMoves, onPlayerMove, onReset, lang }: ArenaProps) {
  const { t } = useLanguage();
  const ended = battle.outcome !== 'ongoing';

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <CombatantCard
          combatant={battle.opponent}
          tone="bg-destructive/10 border-destructive/30"
          labelAr="الخصم"
          labelEn="Opponent"
        />
        <CombatantCard
          combatant={battle.player}
          tone="bg-primary/10 border-primary/30"
          labelAr="فريقك"
          labelEn="You"
        />
      </div>

      {ended ? (
        <div className={cn(
          'glass rounded-2xl p-6 text-center border',
          battle.outcome === 'player_won' && 'bg-emerald-500/10 border-emerald-500/40',
          battle.outcome === 'opponent_won' && 'bg-destructive/10 border-destructive/40',
          battle.outcome === 'draw' && 'bg-muted/30 border-border/40',
        )}>
          {battle.outcome === 'player_won' && (
            <>
              <Trophy className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
              <div className="font-bold text-lg">{t('فزت بالمعركة!', 'You won!')}</div>
            </>
          )}
          {battle.outcome === 'opponent_won' && (
            <>
              <Skull className="w-10 h-10 mx-auto text-destructive mb-2" />
              <div className="font-bold text-lg">{t('غُلب فريقك…', 'You were defeated…')}</div>
            </>
          )}
          {battle.outcome === 'draw' && (
            <>
              <Sparkles className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <div className="font-bold text-lg">{t('تعادل!', "It's a draw!")}</div>
            </>
          )}
          <Button className="mt-3" onClick={onReset}>
            <RotateCcw className="w-4 h-4 me-2" />
            {t('قتال جديد', 'New Battle')}
          </Button>
        </div>
      ) : (
        <div className="glass rounded-2xl p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {t('اختر حركتك', 'Choose your move')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {playerMoves.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => onPlayerMove(m)}
                className="group p-3 rounded-xl border border-border/40 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-colors text-start"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t(m.name_ar, m.name_en)}</span>
                  <Badge
                    className="capitalize text-white"
                    style={{ backgroundColor: `hsl(var(--type-${m.type}))` }}
                  >
                    {m.type}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                  <span>{t('قوة', 'Power')}: {m.power ?? '—'}</span>
                  <span>{t('دقة', 'Acc')}: {m.accuracy ?? 100}</span>
                  <span className="capitalize">{m.category}</span>
                </div>
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={onReset}>
            {t('استسلام', 'Forfeit')}
          </Button>
        </div>
      )}

      <BattleLog battle={battle} lang={lang} />
    </div>
  );
}

interface CombatantCardProps {
  combatant: BattleState['player'];
  tone: string;
  labelAr: string;
  labelEn: string;
}

function CombatantCard({ combatant, tone, labelAr, labelEn }: CombatantCardProps) {
  const { t } = useLanguage();
  const pct = Math.max(0, Math.round((combatant.currentHp / combatant.maxHp) * 100));
  const hpColor = pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-destructive';

  return (
    <div className={cn('glass rounded-2xl p-3 border', tone)}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {t(labelAr, labelEn)}
        </div>
        <div className="text-xs">Lv {combatant.level}</div>
      </div>
      <div className="flex items-center gap-3">
        <PokemonImageWithFallback
          pokemonId={combatant.pokemon.id}
          dexNo={combatant.pokemon.dex_no}
          name={combatant.pokemon.name_en}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold truncate">{t(combatant.pokemon.name_ar, combatant.pokemon.name_en)}</div>
          <div className="flex gap-1 mt-0.5 mb-1.5">
            {combatant.pokemon.types.map(type => (
              <span
                key={type}
                className="px-1.5 py-0.5 text-[10px] font-medium rounded-full capitalize text-white"
                style={{ backgroundColor: `hsl(var(--type-${type}))` }}
              >
                {type}
              </span>
            ))}
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn('h-full transition-all duration-500', hpColor)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 tabular-nums">
            {combatant.currentHp} / {combatant.maxHp}
          </div>
        </div>
      </div>
    </div>
  );
}

function BattleLog({ battle, lang }: { battle: BattleState; lang: 'ar' | 'en' }) {
  const { t } = useLanguage();
  return (
    <div className="glass rounded-2xl p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {t('سجل المعركة', 'Battle Log')}
      </div>
      <ScrollArea className="h-48">
        <ul className="space-y-1 text-sm">
          {battle.log.map((entry, idx) => (
            <li
              key={idx}
              className={cn(
                'leading-snug',
                entry.kind === 'critical' && 'text-amber-500 font-semibold',
                entry.kind === 'effective' && 'text-emerald-500',
                entry.kind === 'miss' && 'text-muted-foreground italic',
                entry.kind === 'faint' && 'text-destructive font-medium',
                entry.kind === 'attack' && 'text-foreground',
                entry.kind === 'info' && 'text-muted-foreground',
              )}
            >
              <span className="text-[10px] tabular-nums text-muted-foreground me-1.5">
                T{entry.turn}
              </span>
              {lang === 'ar' ? entry.text_ar : entry.text_en}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
