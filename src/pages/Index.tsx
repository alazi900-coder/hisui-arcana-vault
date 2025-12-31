import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { loadSeedData } from '@/lib/seed-data';
import { PokemonCard } from '@/components/PokemonCard';
import { Link } from 'react-router-dom';
import { 
  Grid3X3, Swords, Package, MapPin, ClipboardList, GitCompare, 
  Upload, Sparkles, Crown, Zap, FlaskConical 
} from 'lucide-react';

const quickLinks = [
  { path: '/pokemon', icon: Grid3X3, labelAr: 'بوكيدكس', labelEn: 'Pokédex', color: 'bg-primary/20 text-primary' },
  { path: '/moves', icon: Swords, labelAr: 'الحركات', labelEn: 'Moves', color: 'bg-destructive/20 text-destructive' },
  { path: '/items', icon: Package, labelAr: 'العناصر', labelEn: 'Items', color: 'bg-accent/20 text-accent' },
  { path: '/recipes', icon: FlaskConical, labelAr: 'الوصفات', labelEn: 'Recipes', color: 'bg-type-poison/20 text-type-poison' },
  { path: '/locations', icon: MapPin, labelAr: 'المواقع', labelEn: 'Locations', color: 'bg-type-grass/20 text-type-grass' },
  { path: '/requests', icon: ClipboardList, labelAr: 'المهام', labelEn: 'Requests', color: 'bg-type-psychic/20 text-type-psychic' },
  { path: '/compare', icon: GitCompare, labelAr: 'المقارنة', labelEn: 'Compare', color: 'bg-gold/20 text-gold' },
];

export default function Index() {
  const { t } = useLanguage();

  // Load seed data on first visit
  useEffect(() => {
    loadSeedData();
  }, []);

  const pokemon = useLiveQuery(() => db.pokemon.toArray(), []);
  
  // Get featured pokemon
  const legendaries = pokemon?.filter(p => p.tags.includes('legendary') || p.tags.includes('mythical')) || [];
  const starters = pokemon?.filter(p => p.tags.includes('starter')) || [];
  
  // Pokemon of the day (based on date)
  const today = new Date().getDate();
  const pokemonOfDay = pokemon?.[today % (pokemon?.length || 1)];

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