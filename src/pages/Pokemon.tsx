import { useLanguage } from '@/contexts/LanguageContext';
import { PokemonCard } from '@/components/PokemonCard';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PokemonPage() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const pokemon = useLiveQuery(async () => {
    let query = db.pokemon.orderBy('dex_no');
    const all = await query.toArray();
    
    return all.filter(p => {
      const matchesSearch = !search || 
        p.name_ar.includes(search) || 
        p.name_en.toLowerCase().includes(search.toLowerCase()) ||
        String(p.dex_no).includes(search);
      
      const matchesType = !typeFilter || p.types.includes(typeFilter as any);
      
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const types = ['fire', 'water', 'grass', 'electric', 'psychic', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ice'];

  return (
    <div className="pb-20 pt-4">
      <div className="container px-4">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4 text-gradient">
          {t('موسوعة البوكيمون', 'Pokédex')}
        </h1>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('بحث بالاسم أو الرقم...', 'Search by name or number...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ps-9 bg-secondary/50"
            />
          </div>
        </div>

        {/* Type filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          <Button
            variant={typeFilter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter(null)}
            className="shrink-0"
          >
            {t('الكل', 'All')}
          </Button>
          {types.map(type => (
            <Button
              key={type}
              variant={typeFilter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(type)}
              className="shrink-0 capitalize"
              style={typeFilter === type ? {
                backgroundColor: `hsl(var(--type-${type}))`,
                borderColor: `hsl(var(--type-${type}))`
              } : {}}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pokemon?.map((p, i) => (
            <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <PokemonCard pokemon={p} />
            </div>
          ))}
        </div>

        {pokemon?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('لا توجد نتائج', 'No results found')}
          </div>
        )}
      </div>
    </div>
  );
}
