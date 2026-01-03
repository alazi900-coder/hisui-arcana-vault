import { useState } from 'react';
import { Target, Loader2, MapPin, Clock, Sun, Moon, CloudRain, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import type { Pokemon, Spawn } from '@/types/pokemon';

interface CatchHelperProps {
  pokemon: Pokemon;
  spawns: Spawn[];
  isOpen: boolean;
  onClose: () => void;
}

export function CatchHelper({ pokemon, spawns, isOpen, onClose }: CatchHelperProps) {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAIAdvice = async () => {
    setIsLoading(true);
    setAdvice(null);

    try {
      // Format spawn data for AI
      const spawnInfo = spawns.map(s => ({
        area: lang === 'ar' ? s.area_ar : s.area_en,
        conditions: lang === 'ar' ? s.conditions_ar : s.conditions_en,
        rarity: s.rarity,
        isAlpha: s.is_alpha,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/catch-helper`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            pokemon: {
              name: lang === 'ar' ? pokemon.name_ar : pokemon.name_en,
              types: pokemon.types,
              rarity: spawns[0]?.rarity || 'common',
            },
            spawns: spawnInfo,
            language: lang,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(t('تم تجاوز الحد المسموح', 'Rate limit exceeded'));
        }
        throw new Error(t('فشل الاتصال', 'Connection failed'));
      }

      const data = await response.json();
      setAdvice(data.advice);
    } catch (error) {
      console.error('Catch helper error:', error);
      toast({
        title: t('خطأ', 'Error'),
        description: error instanceof Error ? error.message : t('حدث خطأ', 'An error occurred'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getRarityBadge = (rarity: string) => {
    const config = {
      common: { label: t('شائع', 'Common'), class: 'bg-muted text-muted-foreground' },
      uncommon: { label: t('غير شائع', 'Uncommon'), class: 'bg-type-grass/20 text-type-grass' },
      rare: { label: t('نادر', 'Rare'), class: 'bg-type-water/20 text-type-water' },
      very_rare: { label: t('نادر جداً', 'Very Rare'), class: 'bg-type-dragon/20 text-type-dragon' },
    };
    return config[rarity as keyof typeof config] || config.common;
  };

  const getConditionIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('night') || lower.includes('ليل')) return <Moon className="w-3 h-3" />;
    if (lower.includes('day') || lower.includes('نهار')) return <Sun className="w-3 h-3" />;
    if (lower.includes('storm') || lower.includes('عواصف') || lower.includes('rain')) return <CloudRain className="w-3 h-3" />;
    return <Clock className="w-3 h-3" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t('مساعد الصيد', 'Catch Helper')}</h3>
              <p className="text-xs text-muted-foreground">
                {lang === 'ar' ? pokemon.name_ar : pokemon.name_en}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {/* Spawn Locations */}
          <div className="mb-4">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              {t('مواقع الظهور', 'Spawn Locations')}
            </h4>
            
            {spawns.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t('لا توجد بيانات ظهور', 'No spawn data available')}
              </p>
            ) : (
              <div className="space-y-2">
                {spawns.slice(0, 5).map((spawn, i) => (
                  <div key={i} className="glass rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {lang === 'ar' ? spawn.area_ar : spawn.area_en}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          {getConditionIcon(spawn.conditions_en)}
                          <span>{lang === 'ar' ? spawn.conditions_ar : spawn.conditions_en}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getRarityBadge(spawn.rarity).class}>
                          {getRarityBadge(spawn.rarity).label}
                        </Badge>
                        {spawn.is_alpha && (
                          <Badge className="bg-amber-500/20 text-amber-400">
                            Alpha ⭐
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Advice Section */}
          <div className="border-t pt-4">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              {t('نصائح ذكية', 'AI Tips')}
            </h4>
            
            {!advice && !isLoading && (
              <Button onClick={getAIAdvice} className="w-full" disabled={spawns.length === 0}>
                <Sparkles className="w-4 h-4 me-2" />
                {t('احصل على نصائح الصيد', 'Get Catching Tips')}
              </Button>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {advice && (
              <div className="glass rounded-lg p-4 space-y-2">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{advice}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={getAIAdvice}
                  className="mt-3"
                >
                  <Sparkles className="w-3 h-3 me-1" />
                  {t('نصائح جديدة', 'More Tips')}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
