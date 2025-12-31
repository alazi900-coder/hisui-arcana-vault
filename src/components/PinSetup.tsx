import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PinSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pin: string) => void;
  currentPin?: string;
}

export function PinSetup({ open, onOpenChange, onSave, currentPin }: PinSetupProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>(!currentPin ? 'new' : 'current');
  const [currentInput, setCurrentInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setStep(!currentPin ? 'new' : 'current');
    setCurrentInput('');
    setNewPin('');
    setConfirmPin('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleCurrentSubmit = () => {
    if (currentInput !== currentPin) {
      setError(t('رمز PIN الحالي خاطئ', 'Current PIN is wrong'));
      return;
    }
    setStep('new');
    setError('');
  };

  const handleNewSubmit = () => {
    if (newPin.length < 4 || newPin.length > 6) {
      setError(t('يجب أن يكون الرمز 4-6 أرقام', 'PIN must be 4-6 digits'));
      return;
    }
    if (!/^\d+$/.test(newPin)) {
      setError(t('يجب أن يكون أرقام فقط', 'PIN must be digits only'));
      return;
    }
    setStep('confirm');
    setError('');
  };

  const handleConfirmSubmit = () => {
    if (confirmPin !== newPin) {
      setError(t('الرمز غير متطابق', 'PINs do not match'));
      return;
    }
    onSave(newPin);
    toast.success(t('تم حفظ رمز PIN', 'PIN saved successfully'));
    handleClose();
  };

  const getTitle = () => {
    if (step === 'current') return t('أدخل الرمز الحالي', 'Enter Current PIN');
    if (step === 'new') return t('تعيين رمز جديد', 'Set New PIN');
    return t('تأكيد الرمز', 'Confirm PIN');
  };

  const getDescription = () => {
    if (step === 'current') return t('أدخل رمز PIN الحالي للمتابعة', 'Enter your current PIN to continue');
    if (step === 'new') return t('اختر رمز PIN من 4-6 أرقام', 'Choose a 4-6 digit PIN');
    return t('أعد إدخال الرمز للتأكيد', 'Re-enter PIN to confirm');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'current' && (
            <div className="space-y-2">
              <Label>{t('الرمز الحالي', 'Current PIN')}</Label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
              />
            </div>
          )}

          {step === 'new' && (
            <div className="space-y-2">
              <Label>{t('الرمز الجديد', 'New PIN')}</Label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
              />
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-2">
              <Label>{t('تأكيد الرمز', 'Confirm PIN')}</Label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('إلغاء', 'Cancel')}
          </Button>
          {step === 'current' && (
            <Button onClick={handleCurrentSubmit}>
              {t('التالي', 'Next')}
            </Button>
          )}
          {step === 'new' && (
            <Button onClick={handleNewSubmit}>
              {t('التالي', 'Next')}
            </Button>
          )}
          {step === 'confirm' && (
            <Button onClick={handleConfirmSubmit}>
              {t('حفظ', 'Save')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
