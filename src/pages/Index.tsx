import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getRecents } from '@/lib/db';
import { loadSeedData } from '@/lib/seed-data';
import { PokemonCard } from '@/components/PokemonCard';
import { Link } from 'react-router-dom';
import { 
  Grid3X3, Swords, Package, MapPin, ClipboardList, GitCompare, 
  Upload, Sparkles, Crown, Zap, FlaskConical, Clock, Search
} from 'lucide-react';

const quickLinks = [
  { path: '/pokemon', icon: Grid3X3, labelAr: 'بوكيدكس', labelEn: 'Pokédex', color: 'bg-primary/20 text-primary' },
  { path: '/moves', icon: Swords, labelAr: 'الحركات', labelEn: 'Moves', color: 'bg-destructive/20 text-destructive' },
  { path: '/items', icon: Package, labelAr: 'العناصر', labelEn: 'Items', color: 'bg-accent/20 text-accent' },
  { path: '/recipes', icon: FlaskConical, labelAr: 'الوصفات', labelEn: 'Recipes', color: 'bg-type-poison/20 text-type-poison' },
  { path: '/locations', icon: MapPin, labelAr: 'المواقع', labelEn: 'Locations', color: 'bg-type-grass/20 text-type-grass' },
  { path: '/requests', icon: ClipboardList, labelAr: 'المهام', labelEn: 'Requests', color: 'bg-type-psychic/20 text-type-psychic' },
  { path: '/compare', icon: GitCompare, labelAr: 'المقارنة', labelEn: 'Compare', color: 'bg-gold/20 text-gold' },
  { path: '/search', icon: Search, labelAr: 'البحث', labelEn: 'Search', color: 'bg-type-water/20 text-type-water' },
];

const typeIcons: Record<string, React.ElementType> = {
  pokemon: Grid3X3,
  move: Swords,
  item: Package,
  location: MapPin,
  request: ClipboardList,
};

const typeColors: Record<string, string> = {
  pokemon: 'bg-primary/20 text-primary',
  move: 'bg-destructive/20 text-destructive',
  item: 'bg-accent/20 text-accent',
  location: 'bg-type-grass/20 text-type-grass',
  request: 'bg-type-psychic/20 text-type-psychic',
};

export default function Index() {
  const { t } = useLanguage();

  // Load seed data on first visit
  useEffect(() => {
    loadSeedData();
  }, []);

  const pokemon = useLiveQuery(() => db.pokemon.toArray(), []);
  const recents = useLiveQuery(() => getRecents(6), []);
  
  // Get recent item details
  const recentDetails = useLiveQuery(async () => {
    if (!recents || recents.length === 0) return [];
    
    const details = await Promise.all(recents.map(async (r) => {
      let name_ar = '', name_en = '';
      switch (r.type) {
        case 'pokemon':
          const poke = await db.pokemon.get(r.id);
          name_ar = poke?.name_ar || '';
          name_en = poke?.name_en || '';
          break;
        case 'move':
          const move = await db.moves.get(r.id);
          name_ar = move?.name_ar || '';
          name_en = move?.name_en || '';
          break;
        case 'item':
          const item = await db.items.get(r.id);
          name_ar = item?.name_ar || '';
          name_en = item?.name_en || '';
          break;
        case 'location':
          const loc = await db.locations.get(r.id);
          name_ar = loc?.name_ar || '';
          name_en = loc?.name_en || '';
          break;
        case 'request':
          const req = await db.requests.get(r.id);
          name_ar = req?.title_ar || '';
          name_en = req?.title_en || '';
          break;
      }
      return { ...r, name_ar, name_en };
    }));
    
    return details.filter(d => d.name_ar || d.name_en);
  }, [recents]);
  
  // Get featured pokemon
  const legendaries = pokemon?.filter(p => p.tags.includes('legendary') || p.tags.includes('mythical')) || [];
  const starters = pokemon?.filter(p => p.tags.includes('starter')) || [];
  
  // Pokemon of the day (based on date)
  const today = new Date().getDate();
  const pokemonOfDay = pokemon?.[today % (pokemon?.length || 1)];

  const getRecentLink = (type: string, id: string) => {
    switch (type) {
      case 'pokemon': return `/pokemon/${id}`;
      case 'move': return `/moves/${id}`;
      case 'item': return `/items/${id}`;
      case 'location': return `/locations/${id}`;
      case 'request': return `/requests/${id}`;
      default: return '/';
    }
  };

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Hero */}
        <div className="glass rounded-2xl p-6 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative">
            <h1 className="text-3xl font-bold text-gradient mb-2">PLA Dex X</h1>
            <p className="text-muted-foreground">
              {t('دليلك الشامل لعالم بوكيمون أركيوس', 'Your complete guide to Pokémon Legends: Arceus')}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickLinks.map((link, i) => (
            <Link 
              key={link.path} 
              to={link.path}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`glass rounded-xl p-4 text-center card-hover ${link.color.split(' ')[0]}`}>
                <link.icon className={`w-6 h-6 mx-auto mb-2 ${link.color.split(' ')[1]}`} />
                <span className="text-sm font-medium text-foreground">
                  {t(link.labelAr, link.labelEn)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pokemon of the Day */}
        {pokemonOfDay && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="font-semibold text-foreground">
                {t('بوكيمون اليوم', 'Pokémon of the Day')}
              </h2>
            </div>
            <div className="max-w-[200px]">
              <PokemonCard pokemon={pokemonOfDay} />
            </div>
          </div>
        )}

        {/* Recent History */}
        {recentDetails && recentDetails.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">
                {t('آخر ما شاهدته', 'Recently Viewed')}
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {recentDetails.map((r, i) => {
                const Icon = typeIcons[r.type];
                return (
                  <Link
                    key={`${r.type}-${r.id}`}
                    to={getRecentLink(r.type, r.id)}
                    className="shrink-0 animate-fade-in-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="glass rounded-xl p-3 flex items-center gap-2 card-hover min-w-[140px]">
                      <div className={`p-1.5 rounded-lg ${typeColors[r.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground truncate">
                        {t(r.name_ar, r.name_en)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Starters */}
        {starters.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">
                {t('البوكيمونات الأولى', 'Starter Pokémon')}
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {starters.map((poke, i) => (
                <div 
                  key={poke.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <PokemonCard pokemon={poke} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legendaries */}
        {legendaries.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-gold" />
              <h2 className="font-semibold text-foreground">
                {t('الأسطوريون', 'Legendary Pokémon')}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {legendaries.slice(0, 6).map((poke, i) => (
                <div 
                  key={poke.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <PokemonCard pokemon={poke} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import Data Link */}
        <Link to="/data-import">
          <div className="glass rounded-xl p-4 flex items-center gap-3 card-hover">
            <div className="p-2 rounded-lg bg-primary/20">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">
                {t('استيراد البيانات', 'Import Data')}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('استورد Data Pack كامل', 'Import a full Data Pack')}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}