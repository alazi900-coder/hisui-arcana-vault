import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Loader2, Swords, Target, Shield, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Pokemon, Move } from '@/types/pokemon';
import { cn } from '@/lib/utils';

interface MoveRecommendation {
  move_name: string;
  reason: string;
  category: 'offense' | 'defense' | 'utility' | 'stab';
}

interface MoveAdvisorResponse {
  recommended_moves: MoveRecommendation[];
  strategy: string;
  playstyle: string;
}

interface MoveAdvisorProps {
  pokemon: Pokemon;
  moves: Move[];
}

export function MoveAdvisor({ pokemon, moves }: MoveAdvisorProps) {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MoveAdvisorResponse | null>(null);
  
  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Prepare move data
      const availableMoves = pokemon.learnset?.map(entry => {
        const move = moves.find(m => m.id === entry.move_id);
        return move ? {
          name: move.name_en,
          type: move.type,
          category: move.category,
          power: move.power,
          accuracy: move.accuracy,
        } : null;
      }).filter(Boolean);
      
      const { data, error } = await supabase.functions.invoke('move-advisor', {
        body: {
          pokemon: {
            name: pokemon.name_en,
            types: pokemon.types,
            stats: pokemon.stats,
          },
          moves: availableMoves,
          language: lang,
        },
      });
      
      if (error) throw error;
      
      setResult(data);
    } catch (err) {
      console.error('Move advisor error:', err);
      toast.error(t('فشل في الحصول على الاقتراحات', 'Failed to get suggestions'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const categoryIcons = {
    offense: Swords,
    defense: Shield,
    utility: Target,
    stab: Zap,
  };
  
  const categoryColors = {
    offense: 'bg-destructive/20 text-destructive border-destructive/30',
    defense: 'bg-type-grass/20 text-type-grass border-type-grass/30',
    utility: 'bg-type-psychic/20 text-type-psychic border-type-psychic/30',
    stab: 'bg-primary/20 text-primary border-primary/30',
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => {
          setIsOpen(true);
          if (!result) handleAnalyze();
        }}
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        {t('اقتراح Moveset', 'Suggest Moveset')}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t('اقتراح الحركات الأمثل', 'Optimal Moveset Suggestion')}
            </DialogTitle>
          </DialogHeader>
          
          {isLoading && (
            <div className="py-12 text-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {t('جاري تحليل الحركات...', 'Analyzing moves...')}
              </p>
            </div>
          )}
          
          {result && (
            <div className="space-y-4">
              {/* Strategy */}
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
                <h4 className="font-semibold text-sm mb-1">
                  {t('الاستراتيجية', 'Strategy')}
                </h4>
                <p className="text-sm text-muted-foreground">{result.strategy}</p>
              </div>
              
              {/* Playstyle */}
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/30">
                <h4 className="font-semibold text-sm mb-1">
                  {t('نمط اللعب', 'Playstyle')}
                </h4>
                <p className="text-sm text-muted-foreground">{result.playstyle}</p>
              </div>
              
              {/* Recommended Moves */}
              <div>
                <h4 className="font-semibold text-sm mb-3">
                  {t('الحركات المُقترحة', 'Recommended Moves')}
                </h4>
                <div className="space-y-2">
                  {result.recommended_moves?.map((rec, idx) => {
                    const Icon = categoryIcons[rec.category] || Swords;
                    return (
                      <div 
                        key={idx}
                        className={cn(
                          'p-3 rounded-xl border animate-fade-in-up',
                          categoryColors[rec.category] || 'bg-secondary border-border'
                        )}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4" />
                          <span className="font-bold">{rec.move_name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.reason}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Retry Button */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {t('إعادة التحليل', 'Analyze Again')}
              </Button>
            </div>
          )}
          
          {!isLoading && !result && (
            <div className="py-8 text-center">
              <Button onClick={handleAnalyze}>
                <Sparkles className="w-4 h-4 me-2" />
                {t('تحليل الحركات', 'Analyze Moves')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
