import { useOnlineStatus } from '@/hooks/use-online-status';
import { useLanguage } from '@/contexts/LanguageContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function OfflineIndicator() {
  const { isOnline } = useOnlineStatus();
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShow(true);
      setTimeout(() => setAnimateIn(true), 50);
    } else {
      setAnimateIn(false);
      // Show "back online" message briefly
      if (show) {
        setTimeout(() => setShow(false), 2000);
      }
    }
  }, [isOnline, show]);

  if (!show && isOnline) return null;

  return (
    <div
      className={cn(
        'fixed top-16 inset-x-0 z-50 transition-all duration-300 ease-out',
        animateIn ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
    >
      <div
        className={cn(
          'mx-4 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium shadow-lg',
          isOnline
            ? 'bg-emerald-500/90 text-white'
            : 'bg-destructive/90 text-destructive-foreground'
        )}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>{t('تم استعادة الاتصال', 'Back online')}</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>{t('أنت تعمل بدون اتصال', 'You are offline')}</span>
            <RefreshCw className="w-3 h-3 ms-1 animate-spin" />
          </>
        )}
      </div>
    </div>
  );
}
