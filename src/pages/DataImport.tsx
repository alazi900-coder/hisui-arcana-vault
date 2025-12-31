import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, FileJson, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { db } from '@/lib/db';
import type { DataPack } from '@/types/pokemon';

export default function DataImportPage() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const validateDataPack = (data: unknown): data is DataPack => {
    if (typeof data !== 'object' || data === null) return false;
    const pack = data as Record<string, unknown>;
    return (
      Array.isArray(pack.pokemon) &&
      Array.isArray(pack.moves) &&
      Array.isArray(pack.items) &&
      Array.isArray(pack.locations) &&
      Array.isArray(pack.spawns)
    );
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setResult(null);

    try {
      const text = await file.text();
      setProgress(20);

      const data = JSON.parse(text);
      setProgress(40);

      if (!validateDataPack(data)) {
        throw new Error(t('تنسيق الملف غير صحيح', 'Invalid file format'));
      }
      setProgress(60);

      // Clear existing data
      await db.pokemon.clear();
      await db.moves.clear();
      await db.items.clear();
      await db.locations.clear();
      await db.spawns.clear();
      await db.requests.clear();
      setProgress(70);

      // Import new data
      if (data.pokemon.length) await db.pokemon.bulkAdd(data.pokemon);
      setProgress(80);
      if (data.moves.length) await db.moves.bulkAdd(data.moves);
      if (data.items.length) await db.items.bulkAdd(data.items);
      setProgress(90);
      if (data.locations.length) await db.locations.bulkAdd(data.locations);
      if (data.spawns.length) await db.spawns.bulkAdd(data.spawns);
      if (data.requests?.length) await db.requests.bulkAdd(data.requests);
      setProgress(100);

      setResult({ 
        success: true, 
        message: t(
          `تم استيراد ${data.pokemon.length} بوكيمون، ${data.moves.length} حركة، ${data.items.length} عنصر`,
          `Imported ${data.pokemon.length} Pokémon, ${data.moves.length} moves, ${data.items.length} items`
        )
      });
      toast.success(t('تم الاستيراد بنجاح', 'Import successful'));
    } catch (error) {
      setResult({ 
        success: false, 
        message: error instanceof Error ? error.message : t('حدث خطأ', 'An error occurred')
      });
      toast.error(t('فشل الاستيراد', 'Import failed'));
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const template: Partial<DataPack> = {
      version: '1.0.0',
      locale_default: 'ar',
      pokemon: [
        {
          id: 'example',
          dex_no: 1,
          name_ar: 'مثال',
          name_en: 'Example',
          types: ['normal'],
          tags: [],
          stats: { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 },
          description_ar: 'وصف بالعربي',
          description_en: 'Description in English',
          evolutions: [],
          images: { thumb: '', artwork: '' },
          learnset: [],
          spawn_refs: [],
        }
      ],
      moves: [],
      items: [],
      locations: [],
      spawns: [],
      requests: [],
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pla-dex-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/20">
            <FileJson className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">
              {t('استيراد البيانات', 'Import Data')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('استورد Data Pack كامل', 'Import a full Data Pack')}
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div 
          className="glass rounded-2xl p-8 border-2 border-dashed border-border/50 text-center mb-6 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileSelect}
            disabled={importing}
          />
          
          {importing ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
              <div className="text-foreground font-medium">
                {t('جاري الاستيراد...', 'Importing...')}
              </div>
              <Progress value={progress} className="max-w-xs mx-auto" />
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <div className="text-foreground font-medium mb-2">
                {t('اضغط لاختيار ملف JSON', 'Click to select a JSON file')}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('أو اسحب وأفلت الملف هنا', 'Or drag and drop a file here')}
              </div>
            </>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className={`glass rounded-xl p-4 mb-6 flex items-start gap-3 animate-fade-in-up ${
            result.success ? 'border border-type-grass/50' : 'border border-destructive/50'
          }`}>
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-type-grass shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            )}
            <div className={result.success ? 'text-type-grass' : 'text-destructive'}>
              {result.message}
            </div>
          </div>
        )}

        {/* Template Download */}
        <div className="glass rounded-xl p-4">
          <h2 className="font-medium mb-2">{t('تحتاج قالب؟', 'Need a template?')}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t(
              'حمّل قالب JSON يوضح هيكل البيانات المطلوب',
              'Download a JSON template showing the required data structure'
            )}
          </p>
          <Button variant="secondary" onClick={downloadTemplate}>
            <FileJson className="w-4 h-4 me-2" />
            {t('تحميل القالب', 'Download Template')}
          </Button>
        </div>
      </div>
    </div>
  );
}