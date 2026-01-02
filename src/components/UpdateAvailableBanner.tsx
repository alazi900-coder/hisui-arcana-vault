import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function UpdateAvailableBanner() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      const handleUpdate = async () => {
        const reg = await navigator.serviceWorker.ready;
        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                setShowBanner(true);
                setRegistration(reg);
              }
            });
          }
        });
      };

      handleUpdate();

      // Also check if there's already a waiting worker
      navigator.serviceWorker.ready.then(reg => {
        if (reg.waiting) {
          setShowBanner(true);
          setRegistration(reg);
        }
      });
    }
  }, []);

  const handleReload = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className={cn(
        'fixed bottom-20 inset-x-4 z-50 animate-fade-in-up',
        'glass rounded-xl p-3 shadow-lg border border-primary/30'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 text-primary" />
          <span>{t('يتوفر تحديث جديد', 'Update available')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleReload} className="h-7 text-xs">
            {t('تحديث الآن', 'Reload')}
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleDismiss}
            className="h-7 w-7 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
