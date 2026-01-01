import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLivingDexEntry, toggleLivingDexField, updateLivingDexNotes } from '@/hooks/use-living-dex';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, Sparkles, FileText, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LivingDexProgressProps {
  pokemonId: string;
  pokemonName: string;
}

export function LivingDexProgress({ pokemonId, pokemonName }: LivingDexProgressProps) {
  const { t } = useLanguage();
  const entry = useLivingDexEntry(pokemonId);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  
  // Initialize notes from entry when it loads
  const currentNotes = entry?.notes ?? '';
  
  const handleToggle = async (field: 'caught' | 'alpha' | 'shiny') => {
    const newValue = await toggleLivingDexField(pokemonId, field);
    
    const messages = {
      caught: {
        true: t('تم تسجيل الإمساك!', 'Marked as caught!'),
        false: t('تم إلغاء تسجيل الإمساك', 'Unmarked as caught'),
      },
      alpha: {
        true: t('تم تسجيل ألفا!', 'Marked as Alpha!'),
        false: t('تم إلغاء تسجيل ألفا', 'Unmarked as Alpha'),
      },
      shiny: {
        true: t('تم تسجيل لامع!', 'Marked as Shiny!'),
        false: t('تم إلغاء تسجيل لامع', 'Unmarked as Shiny'),
      },
    };
    
    toast.success(messages[field][String(newValue) as 'true' | 'false']);
  };
  
  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await updateLivingDexNotes(pokemonId, notes || currentNotes);
      toast.success(t('تم حفظ الملاحظات', 'Notes saved'));
      setShowNotes(false);
    } finally {
      setIsSavingNotes(false);
    }
  };
  
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/30 backdrop-blur-sm animate-fade-in-up">
      <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        {t('تقدمي', 'My Progress')}
      </h3>
      
      {/* Toggle Controls */}
      <div className="space-y-4">
        {/* Caught Toggle */}
        <div 
          className={cn(
            'flex items-center justify-between p-4 rounded-xl transition-all',
            entry?.caught 
              ? 'bg-emerald-500/20 border border-emerald-500/40' 
              : 'bg-secondary/30 border border-border/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              entry?.caught ? 'bg-emerald-500/30' : 'bg-secondary/50'
            )}>
              <CheckCircle2 className={cn(
                'w-5 h-5',
                entry?.caught ? 'text-emerald-400' : 'text-muted-foreground'
              )} />
            </div>
            <div>
              <div className="font-semibold">{t('تم الإمساك', 'Caught')}</div>
              <div className="text-xs text-muted-foreground">
                {t('سجل هذا البوكيمون كممسوك', 'Mark as caught in your collection')}
              </div>
            </div>
          </div>
          <Switch 
            checked={entry?.caught ?? false}
            onCheckedChange={() => handleToggle('caught')}
          />
        </div>
        
        {/* Alpha Toggle */}
        <div 
          className={cn(
            'flex items-center justify-between p-4 rounded-xl transition-all',
            entry?.alpha 
              ? 'bg-red-500/20 border border-red-500/40' 
              : 'bg-secondary/30 border border-border/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              entry?.alpha ? 'bg-red-500/30' : 'bg-secondary/50'
            )}>
              <Star className={cn(
                'w-5 h-5',
                entry?.alpha ? 'text-red-400 fill-red-400' : 'text-muted-foreground'
              )} />
            </div>
            <div>
              <div className="font-semibold">{t('ألفا', 'Alpha')}</div>
              <div className="text-xs text-muted-foreground">
                {t('لديك نسخة ألفا من هذا البوكيمون', 'You have an Alpha version')}
              </div>
            </div>
          </div>
          <Switch 
            checked={entry?.alpha ?? false}
            onCheckedChange={() => handleToggle('alpha')}
          />
        </div>
        
        {/* Shiny Toggle */}
        <div 
          className={cn(
            'flex items-center justify-between p-4 rounded-xl transition-all',
            entry?.shiny 
              ? 'bg-yellow-500/20 border border-yellow-500/40' 
              : 'bg-secondary/30 border border-border/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              entry?.shiny ? 'bg-yellow-500/30' : 'bg-secondary/50'
            )}>
              <Sparkles className={cn(
                'w-5 h-5',
                entry?.shiny ? 'text-yellow-400' : 'text-muted-foreground'
              )} />
            </div>
            <div>
              <div className="font-semibold">{t('لامع', 'Shiny')}</div>
              <div className="text-xs text-muted-foreground">
                {t('لديك نسخة لامعة من هذا البوكيمون', 'You have a Shiny version')}
              </div>
            </div>
          </div>
          <Switch 
            checked={entry?.shiny ?? false}
            onCheckedChange={() => handleToggle('shiny')}
          />
        </div>
      </div>
      
      {/* Notes Section */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <button
          onClick={() => {
            setShowNotes(!showNotes);
            if (!showNotes) {
              setNotes(currentNotes);
            }
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <FileText className="w-4 h-4" />
          {t('ملاحظاتي', 'My Notes')}
          {currentNotes && !showNotes && (
            <span className="text-xs text-primary">({t('يوجد ملاحظات', 'has notes')})</span>
          )}
        </button>
        
        {showNotes && (
          <div className="mt-3 space-y-3 animate-fade-in-up">
            <Textarea
              placeholder={t(
                `أضف ملاحظاتك عن ${pokemonName} هنا...`,
                `Add your notes about ${pokemonName} here...`
              )}
              value={notes || currentNotes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] bg-secondary/50 border-border/50"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotes(false)}
              >
                {t('إلغاء', 'Cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
              >
                <Save className="w-4 h-4 me-1" />
                {t('حفظ', 'Save')}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Last Updated */}
      {entry?.updated_at && (
        <div className="mt-4 text-xs text-muted-foreground text-center">
          {t('آخر تحديث:', 'Last updated:')} {new Date(entry.updated_at).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
