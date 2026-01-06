import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SaveImportGuide } from '@/components/SaveImportGuide';
import { fullSaveImport } from '@/lib/pkhex-parser';
import type { SaveImportResult } from '@/types/save-data';
import { 
  Upload, FileJson, CheckCircle, AlertCircle, 
  ArrowLeft, Loader2, Sparkles, Package, Target, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ImportStage = 'idle' | 'reading' | 'importing' | 'complete' | 'error';

export default function SaveImport() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stage, setStage] = useState<ImportStage>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<SaveImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.json')) {
        toast.error(t('يرجى اختيار ملف JSON', 'Please select a JSON file'));
        return;
      }
      setSelectedFile(file);
      setShowGuide(false);
      setStage('idle');
      setResult(null);
      setError(null);
    }
  };
  
  const handleImport = async () => {
    if (!selectedFile) return;
    
    try {
      setStage('reading');
      
      const text = await selectedFile.text();
      
      setStage('importing');
      
      const importResult = await fullSaveImport(text);
      
      setResult(importResult);
      setStage('complete');
      
      if (importResult.errors.length === 0) {
        toast.success(
          t(
            `تم استيراد ${importResult.pokemonImported} بوكيمون بنجاح!`,
            `Successfully imported ${importResult.pokemonImported} Pokémon!`
          )
        );
      } else {
        toast.warning(
          t(
            `تم الاستيراد مع ${importResult.errors.length} تحذير`,
            `Import completed with ${importResult.errors.length} warnings`
          )
        );
      }
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStage('error');
      toast.error(t('فشل الاستيراد', 'Import failed'));
    }
  };
  
  return (
    <div className="min-h-screen pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">
              {t('استيراد بيانات اللعبة', 'Import Game Data')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('استورد بياناتك من PKHeX', 'Import your data from PKHeX')}
            </p>
          </div>
        </div>
        
        {/* File Upload Area */}
        <div 
          className={cn(
            'glass rounded-2xl p-6 mb-6 text-center border-2 border-dashed transition-colors cursor-pointer',
            selectedFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileJson className="w-10 h-10 text-primary" />
              <div className="text-start">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">
                {t('اضغط لاختيار ملف', 'Click to select file')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('ملف JSON مصدّر من PKHeX', 'JSON file exported from PKHeX')}
              </p>
            </>
          )}
        </div>
        
        {/* Import Button */}
        {selectedFile && stage !== 'complete' && (
          <Button 
            className="w-full mb-6" 
            size="lg"
            onClick={handleImport}
            disabled={stage === 'reading' || stage === 'importing'}
          >
            {stage === 'reading' || stage === 'importing' ? (
              <>
                <Loader2 className="w-5 h-5 me-2 animate-spin" />
                {stage === 'reading' 
                  ? t('جاري القراءة...', 'Reading...') 
                  : t('جاري الاستيراد...', 'Importing...')
                }
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 me-2" />
                {t('بدء الاستيراد', 'Start Import')}
              </>
            )}
          </Button>
        )}
        
        {/* Progress */}
        {(stage === 'reading' || stage === 'importing') && (
          <div className="glass rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="font-medium">
                {stage === 'reading' 
                  ? t('قراءة الملف...', 'Reading file...') 
                  : t('استيراد البيانات...', 'Importing data...')
                }
              </span>
            </div>
            <Progress value={stage === 'reading' ? 30 : 70} className="h-2" />
          </div>
        )}
        
        {/* Results */}
        {stage === 'complete' && result && (
          <div className="glass rounded-xl p-4 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4 text-type-grass">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold text-lg">
                {t('تم الاستيراد بنجاح!', 'Import Successful!')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10 text-center">
                <Target className="w-6 h-6 text-primary mx-auto mb-1" />
                <div className="text-2xl font-bold text-primary">
                  {result.pokemonImported}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('بوكيمون', 'Pokémon')}
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-type-grass/10 text-center">
                <Sparkles className="w-6 h-6 text-type-grass mx-auto mb-1" />
                <div className="text-2xl font-bold text-type-grass">
                  {result.newPokemon}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('جديد', 'New')}
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-gold/10 text-center">
                <Star className="w-6 h-6 text-gold mx-auto mb-1" />
                <div className="text-2xl font-bold text-gold">
                  {result.alphaFound}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('ألفا', 'Alpha')}
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-accent/10 text-center">
                <Package className="w-6 h-6 text-accent mx-auto mb-1" />
                <div className="text-2xl font-bold text-accent">
                  {result.itemsImported}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('عنصر', 'Items')}
                </div>
              </div>
            </div>
            
            {result.shinyFound > 0 && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-gold/20 to-accent/20 text-center mb-4">
                <span className="text-gold font-bold">
                  ✨ {result.shinyFound} {t('لامع!', 'Shiny!')}
                </span>
              </div>
            )}
            
            {result.errors.length > 0 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {t('تحذيرات', 'Warnings')} ({result.errors.length})
                  </span>
                </div>
                <div className="text-xs text-muted-foreground max-h-20 overflow-y-auto">
                  {result.errors.slice(0, 5).map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                  {result.errors.length > 5 && (
                    <p>...+{result.errors.length - 5} more</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 mt-4">
              <Button 
                className="flex-1" 
                onClick={() => navigate('/tracker')}
              >
                <Target className="w-4 h-4 me-2" />
                {t('عرض المتتبع', 'View Tracker')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedFile(null);
                  setResult(null);
                  setStage('idle');
                  setShowGuide(true);
                }}
              >
                {t('استيراد آخر', 'Import Another')}
              </Button>
            </div>
          </div>
        )}
        
        {/* Error */}
        {stage === 'error' && error && (
          <div className="glass rounded-xl p-4 mb-6 border border-destructive/30">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="w-6 h-6" />
              <span className="font-bold">{t('فشل الاستيراد', 'Import Failed')}</span>
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={() => {
                setStage('idle');
                setError(null);
              }}
            >
              {t('حاول مرة أخرى', 'Try Again')}
            </Button>
          </div>
        )}
        
        {/* Guide */}
        {showGuide && <SaveImportGuide />}
      </div>
    </div>
  );
}
