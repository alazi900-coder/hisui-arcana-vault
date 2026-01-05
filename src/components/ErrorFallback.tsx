import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
}

export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center animate-fade-in-up">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('حدث خطأ', 'Something went wrong')}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-4">
          {t(
            'نأسف، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
            "We're sorry, an unexpected error occurred. Please try again."
          )}
        </p>

        {/* Error details (dev mode) */}
        {error && import.meta.env.DEV && (
          <div className="mb-6 p-3 rounded-lg bg-secondary/50 text-left overflow-auto max-h-32">
            <code className="text-xs text-destructive">{error.message}</code>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onReset && (
            <Button onClick={onReset} variant="default" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {t('حاول مجدداً', 'Try Again')}
            </Button>
          )}
          <Link to="/">
            <Button variant="outline" className="gap-2 w-full">
              <Home className="w-4 h-4" />
              {t('الرئيسية', 'Home')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
