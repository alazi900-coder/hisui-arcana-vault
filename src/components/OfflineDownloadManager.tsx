import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOfflineDownload, getLastDownloadTime, formatBytes } from '@/hooks/use-offline-download';
import { Download, CheckCircle, Database, Image, Loader2, WifiOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface OfflineDownloadManagerProps {
  onComplete?: () => void;
  compact?: boolean;
}

export function OfflineDownloadManager({ onComplete, compact = false }: OfflineDownloadManagerProps) {
  const { t } = useLanguage();
  const { progress, isDownloading, startDownload, resetProgress } = useOfflineDownload();
  const [lastDownload, setLastDownload] = useState<string | null>(null);

  useEffect(() => {
    setLastDownload(getLastDownloadTime());
  }, [progress.stage]);

  useEffect(() => {
    if (progress.stage === 'complete' && onComplete) {
      onComplete();
    }
  }, [progress.stage, onComplete]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStart = () => {
    resetProgress();
    startDownload();
  };

  if (compact && progress.stage === 'idle') {
    return (
      <Button 
        onClick={handleStart} 
        variant="secondary" 
        className="w-full"
        disabled={isDownloading}
      >
        <Download className="w-4 h-4 me-2" />
        {t('تحميل للعمل بدون اتصال', 'Download for Offline')}
      </Button>
    );
  }

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/20">
          <WifiOff className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{t('وضع عدم الاتصال', 'Offline Mode')}</h3>
          <p className="text-xs text-muted-foreground">
            {t('حمّل البيانات والصور للعمل بدون إنترنت', 'Download data & images to work offline')}
          </p>
        </div>
      </div>

      {/* Last download info */}
      {lastDownload && progress.stage === 'idle' && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
          <CheckCircle className="w-4 h-4 text-type-grass" />
          <span>{t('آخر تحميل:', 'Last download:')} {formatDate(lastDownload)}</span>
        </div>
      )}

      {/* Progress stages */}
      {(progress.stage === 'data' || progress.stage === 'images' || progress.stage === 'complete') && (
        <div className="space-y-3">
          {/* Data stage */}
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-1.5 rounded-lg',
              progress.dataProgress === 100 ? 'bg-type-grass/20' : 'bg-secondary'
            )}>
              <Database className={cn(
                'w-4 h-4',
                progress.dataProgress === 100 ? 'text-type-grass' : 'text-muted-foreground'
              )} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{t('البيانات', 'Data')}</span>
                <span>{progress.dataProgress}%</span>
              </div>
              <Progress value={progress.dataProgress} className="h-1.5" />
            </div>
            {progress.dataProgress === 100 && (
              <CheckCircle className="w-4 h-4 text-type-grass" />
            )}
          </div>

          {/* Images stage */}
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-1.5 rounded-lg',
              progress.imagesProgress === 100 ? 'bg-type-grass/20' : 'bg-secondary'
            )}>
              <Image className={cn(
                'w-4 h-4',
                progress.imagesProgress === 100 ? 'text-type-grass' : 'text-muted-foreground'
              )} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{t('الصور', 'Images')}</span>
                <span>{progress.imagesCurrent}/{progress.imagesTotal}</span>
              </div>
              <Progress value={progress.imagesProgress} className="h-1.5" />
            </div>
            {progress.imagesProgress === 100 ? (
              <CheckCircle className="w-4 h-4 text-type-grass" />
            ) : progress.stage === 'images' && (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            )}
          </div>

          {/* Current item */}
          {progress.stage === 'images' && progress.currentItem && (
            <div className="text-xs text-muted-foreground text-center animate-pulse">
              {t('جاري تحميل:', 'Downloading:')} {progress.currentItem}
            </div>
          )}
        </div>
      )}

      {/* Complete message */}
      {progress.stage === 'complete' && (
        <div className="flex items-center gap-2 text-type-grass bg-type-grass/10 rounded-lg px-3 py-2 animate-fade-in-up">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">
            {t('اكتمل التحميل! يمكنك الآن العمل بدون اتصال', 'Download complete! You can now work offline')}
          </span>
        </div>
      )}

      {/* Error message */}
      {progress.stage === 'error' && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          <AlertCircle className="w-5 h-5" />
          <span>{t('حدث خطأ:', 'Error:')} {progress.error}</span>
        </div>
      )}

      {/* Action button */}
      {(progress.stage === 'idle' || progress.stage === 'error') && (
        <Button 
          onClick={handleStart} 
          className="w-full"
          disabled={isDownloading}
        >
          <Download className="w-4 h-4 me-2" />
          {lastDownload 
            ? t('تحديث البيانات والصور', 'Update Data & Images')
            : t('تحميل للعمل بدون اتصال', 'Download for Offline')}
        </Button>
      )}

      {isDownloading && (
        <Button 
          variant="secondary" 
          className="w-full" 
          disabled
        >
          <Loader2 className="w-4 h-4 me-2 animate-spin" />
          {t('جاري التحميل...', 'Downloading...')}
        </Button>
      )}
    </div>
  );
}
