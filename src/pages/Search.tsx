import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, Swords, Package, MapPin, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SearchResult = {
  type: 'pokemon' | 'move' | 'item' | 'location' | 'request';
  id: string;
  name_ar: string;
  name_en: string;
  subtitle?: string;
  icon: React.ReactNode;
};

const typeIcons = {
  pokemon: <Grid3X3 className="w-4 h-4" />,
  move: <Swords className="w-4 h-4" />,
  item: <Package className="w-4 h-4" />,
  location: <MapPin className="w-4 h-4" />,
  request: <ClipboardList className="w-4 h-4" />,
};

const typeColors = {
  pokemon: 'bg-primary/20 text-primary',
  move: 'bg-destructive/20 text-destructive',
  item: 'bg-accent/20 text-accent',
  location: 'bg-type-grass/20 text-type-grass',
  request: 'bg-type-psychic/20 text-type-psychic',
};

const typeLabels = {
  pokemon: { ar: 'بوكيمون', en: 'Pokémon' },
  move: { ar: 'حركة', en: 'Move' },
  item: { ar: 'عنصر', en: 'Item' },
  location: { ar: 'موقع', en: 'Location' },
  request: { ar: 'مهمة', en: 'Request' },
};

export default function SearchPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const pokemon = useLiveQuery(() => db.pokemon.toArray(), []);
  const moves = useLiveQuery(() => db.moves.toArray(), []);
  const items = useLiveQuery(() => db.items.toArray(), []);
  const locations = useLiveQuery(() => db.locations.toArray(), []);
  const requests = useLiveQuery(() => db.requests.toArray(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const all: SearchResult[] = [];

    // Search Pokemon
    if (!activeFilter || activeFilter === 'pokemon') {
      pokemon?.forEach(p => {
        if (p.name_ar.includes(query) || p.name_en.toLowerCase().includes(q) || String(p.dex_no).includes(query)) {
          all.push({
            type: 'pokemon',
            id: p.id,
            name_ar: p.name_ar,
            name_en: p.name_en,
            subtitle: `#${String(p.dex_no).padStart(3, '0')}`,
            icon: typeIcons.pokemon,
          });
        }
      });
    }

    // Search Moves
    if (!activeFilter || activeFilter === 'move') {
      moves?.forEach(m => {
        if (m.name_ar.includes(query) || m.name_en.toLowerCase().includes(q)) {
          all.push({
            type: 'move',
            id: m.id,
            name_ar: m.name_ar,
            name_en: m.name_en,
            subtitle: m.type,
            icon: typeIcons.move,
          });
        }
      });
    }

    // Search Items
    if (!activeFilter || activeFilter === 'item') {
      items?.forEach(i => {
        if (i.name_ar.includes(query) || i.name_en.toLowerCase().includes(q)) {
          all.push({
            type: 'item',
            id: i.id,
            name_ar: i.name_ar,
            name_en: i.name_en,
            subtitle: i.type,
            icon: typeIcons.item,
          });
        }
      });
    }

    // Search Locations
    if (!activeFilter || activeFilter === 'location') {
      locations?.forEach(l => {
        if (l.name_ar.includes(query) || l.name_en.toLowerCase().includes(q)) {
          all.push({
            type: 'location',
            id: l.id,
            name_ar: l.name_ar,
            name_en: l.name_en,
            subtitle: l.region,
            icon: typeIcons.location,
          });
        }
      });
    }

    // Search Requests
    if (!activeFilter || activeFilter === 'request') {
      requests?.forEach(r => {
        if (r.title_ar.includes(query) || r.title_en.toLowerCase().includes(q)) {
          all.push({
            type: 'request',
            id: r.id,
            name_ar: r.title_ar,
            name_en: r.title_en,
            subtitle: r.giver,
            icon: typeIcons.request,
          });
        }
      });
    }

    return all.slice(0, 50); // Limit results
  }, [query, activeFilter, pokemon, moves, items, locations, requests]);

  const getLink = (result: SearchResult) => {
    switch (result.type) {
      case 'pokemon': return `/pokemon/${result.id}`;
      case 'move': return `/moves/${result.id}`;
      case 'item': return `/items/${result.id}`;
      case 'location': return `/locations/${result.id}`;
      case 'request': return `/requests/${result.id}`;
    }
  };

  const filters = ['pokemon', 'move', 'item', 'location', 'request'];

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/20">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gradient">
            {t('البحث', 'Search')}
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t('بحث عن بوكيمون، حركات، عناصر...', 'Search Pokémon, moves, items...')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="ps-11 h-12 text-lg bg-secondary/50"
            autoFocus
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          <button
            onClick={() => setActiveFilter(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm shrink-0 transition-colors',
              !activeFilter ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            )}
          >
            {t('الكل', 'All')}
          </button>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm shrink-0 transition-colors flex items-center gap-1.5',
                activeFilter === filter ? typeColors[filter as keyof typeof typeColors] : 'bg-secondary text-muted-foreground'
              )}
            >
              {typeIcons[filter as keyof typeof typeIcons]}
              {t(typeLabels[filter as keyof typeof typeLabels].ar, typeLabels[filter as keyof typeof typeLabels].en)}
            </button>
          ))}
        </div>

        {/* Results */}
        {query && (
          <div className="text-sm text-muted-foreground mb-4">
            {results.length} {t('نتيجة', 'results')}
          </div>
        )}

        <div className="space-y-2">
          {results.map((result, i) => (
            <Link
              key={`${result.type}-${result.id}`}
              to={getLink(result)}
              className="block animate-fade-in-up"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="glass rounded-xl p-4 flex items-center gap-4 card-hover">
                <div className={cn('p-2 rounded-lg', typeColors[result.type])}>
                  {result.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {t(result.name_ar, result.name_en)}
                  </div>
                  {result.subtitle && (
                    <div className="text-sm text-muted-foreground capitalize">
                      {result.subtitle}
                    </div>
                  )}
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', typeColors[result.type])}>
                  {t(typeLabels[result.type].ar, typeLabels[result.type].en)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('لا توجد نتائج', 'No results found')}
          </div>
        )}

        {/* Initial state */}
        {!query && (
          <div className="text-center py-12 text-muted-foreground">
            {t('ابدأ بالكتابة للبحث', 'Start typing to search')}
          </div>
        )}
      </div>
    </div>
  );
}
