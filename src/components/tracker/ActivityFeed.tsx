import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PokemonImageWithFallback } from '@/components/PokemonImage';
import { Clock, CheckCircle2, Star, Sparkles } from 'lucide-react';
import type { Pokemon } from '@/types/pokemon';

interface ActivityItem {
  pokemon_id: string;
  caught: boolean;
  alpha: boolean;
  shiny: boolean;
  updated_at: string;
  pokemon?: Pokemon;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const { t, lang } = useLanguage();

  if (!activities || activities.length === 0) {
    return (
      <div className="glass rounded-xl p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {t('النشاط الأخير', 'Recent Activity')}
        </h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{t('لا يوجد نشاط بعد', 'No activity yet')}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t('ابدأ بتسجيل بوكيمون من صفحة البوكيمون', 'Start tracking from the Pokémon page')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        {t('النشاط الأخير', 'Recent Activity')}
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {activities.map((item) => (
          <Link 
            key={item.pokemon_id} 
            to={`/pokemon/${item.pokemon_id}`} 
            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all group"
          >
            <div className="relative">
              <PokemonImageWithFallback 
                pokemonId={item.pokemon_id} 
                pokemonName={item.pokemon?.name_en || ''} 
                className="w-12 h-12" 
              />
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
    </div>
  );
}
