import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Lock, Delete } from 'lucide-react';

interface PinLockProps {
  correctPin: string;
  onUnlock: () => void;
}

export function PinLock({ correctPin, onUnlock }: PinLockProps) {
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === correctPin.length) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => {
            setPin('');
            setShake(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6">
      {/* Lock Icon */}
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-10 w-10 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">
        {t('أدخل رمز PIN', 'Enter PIN')}
      </h1>
      <p className="text-muted-foreground mb-8">
        {t('مطلوب لفتح التطبيق', 'Required to unlock the app')}
      </p>

      {/* PIN Dots */}
      <div 
        className={`flex gap-3 mb-8 ${shake ? 'animate-shake' : ''}`}
      >
        {Array.from({ length: correctPin.length }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all ${
              i < pin.length
                ? error
                  ? 'bg-destructive border-destructive'
                  : 'bg-primary border-primary'
                : 'border-muted-foreground'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-destructive text-sm mb-4">
          {t('رمز PIN خاطئ', 'Wrong PIN')}
        </p>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-4 max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            className="w-16 h-16 text-2xl font-semibold"
            onClick={() => handleNumberClick(num.toString())}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="lg"
          className="w-16 h-16 text-sm"
          onClick={handleClear}
        >
          {t('مسح', 'Clear')}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 text-2xl font-semibold"
          onClick={() => handleNumberClick('0')}
        >
          0
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="w-16 h-16"
          onClick={handleDelete}
        >
          <Delete className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
