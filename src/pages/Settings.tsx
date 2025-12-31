import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Settings as SettingsIcon, Globe, Minimize2, Lock, Database, Trash2, Download, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { clearAllData } from '@/lib/db';
import { loadSeedData } from '@/lib/seed-data';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  const handleLanguageToggle = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const handleReloadSeed = async () => {
    await clearAllData();
    await loadSeedData();
    toast.success(t('تم إعادة تحميل البيانات', 'Seed data reloaded'));
  };

  const handleClearData = async () => {
    await clearAllData();
    toast.success(t('تم حذف كل البيانات', 'All data cleared'));
  };

  const handlePinSave = () => {
    if (pin.length >= 4 && pin.length <= 6) {
      setPinEnabled(true);
      setShowPinInput(false);
      toast.success(t('تم تفعيل القفل', 'PIN lock enabled'));
    } else {
      toast.error(t('PIN يجب أن يكون 4-6 أرقام', 'PIN must be 4-6 digits'));
    }
  };

  const handleExport = async () => {
    const { db } = await import('@/lib/db');
    const data = {
      pokemon: await db.pokemon.toArray(),
      moves: await db.moves.toArray(),
      items: await db.items.toArray(),
      locations: await db.locations.toArray(),
      spawns: await db.spawns.toArray(),
      requests: await db.requests.toArray(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pla-dex-data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('تم التصدير', 'Data exported'));
  };

  return (
    <div className="pb-20 pt-20">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-muted">
            <SettingsIcon className="w-6 h-6 text-foreground" />
          </div>
          <h1 className="text-2xl font-bold">
            {t('الإعدادات', 'Settings')}
          </h1>
        </div>

        <div className="space-y-4">
          {/* Language */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">{t('اللغة', 'Language')}</div>
                  <div className="text-sm text-muted-foreground">
                    {lang === 'ar' ? 'العربية' : 'English'}
                  </div>
                </div>
              </div>
              <Switch 
                checked={lang === 'en'} 
                onCheckedChange={handleLanguageToggle}
              />
            </div>
          </div>

          {/* Reduce Motion */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Minimize2 className="w-5 h-5 text-accent" />
                <div>
                  <div className="font-medium">{t('تقليل الحركة', 'Reduce Motion')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('تعطيل الأنيميشن', 'Disable animations')}
                  </div>
                </div>
              </div>
              <Switch 
                checked={reduceMotion} 
                onCheckedChange={setReduceMotion}
              />
            </div>
          </div>

          {/* PIN Lock */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gold" />
                <div>
                  <div className="font-medium">{t('قفل PIN', 'PIN Lock')}</div>
                  <div className="text-sm text-muted-foreground">
                    {pinEnabled 
                      ? t('مُفعّل', 'Enabled') 
                      : t('غير مُفعّل', 'Disabled')}
                  </div>
                </div>
              </div>
              <Switch 
                checked={pinEnabled} 
                onCheckedChange={(checked) => {
                  if (checked) {
                    setShowPinInput(true);
                  } else {
                    setPinEnabled(false);
                    setPin('');
                  }
                }}
              />
            </div>
            
            {showPinInput && (
              <div className="flex gap-2 mt-3 animate-fade-in-up">
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={t('أدخل PIN (4-6 أرقام)', 'Enter PIN (4-6 digits)')}
                  className="bg-secondary"
                />
                <Button onClick={handlePinSave} size="sm">
                  {t('حفظ', 'Save')}
                </Button>
              </div>
            )}
          </div>

          {/* Data Management */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-muted-foreground" />
              <div className="font-medium">{t('إدارة البيانات', 'Data Management')}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleReloadSeed}
              >
                <Download className="w-4 h-4 me-2" />
                {t('إعادة تحميل', 'Reload Seed')}
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleExport}
              >
                <Upload className="w-4 h-4 me-2" />
                {t('تصدير', 'Export')}
              </Button>
              <Button 
                variant="destructive" 
                className="w-full col-span-2"
                onClick={handleClearData}
              >
                <Trash2 className="w-4 h-4 me-2" />
                {t('حذف كل البيانات', 'Clear All Data')}
              </Button>
            </div>
          </div>

          {/* App Info */}
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient mb-1">PLA Dex X</div>
            <div className="text-sm text-muted-foreground">
              {t('دليل بوكيمون أركيوس', 'Pokémon Legends: Arceus Guide')}
            </div>
            <div className="text-xs text-muted-foreground mt-2">v1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}