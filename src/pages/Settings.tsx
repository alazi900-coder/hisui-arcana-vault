import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Settings as SettingsIcon, Globe, Minimize2, Lock, Database, Trash2, Download, Upload, HardDrive, Image, AlertCircle, Sparkles } from 'lucide-react';
import { useAiEnabled } from '@/hooks/use-ai-enabled';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { clearAllData } from '@/lib/db';
import { reloadAllData } from '@/lib/seed-data';
import { OfflineDownloadManager } from '@/components/OfflineDownloadManager';
import { CloudSyncCard } from '@/components/CloudSyncCard';
import { getImageCacheStats, clearImageCache, formatBytes, getLastDownloadTime } from '@/hooks/use-offline-download';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const { aiEnabled, setAiEnabled } = useAiEnabled();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [cacheStats, setCacheStats] = useState<{ count: number; sizeBytes: number } | null>(null);
  const [lastDownload, setLastDownload] = useState<string | null>(null);

  useEffect(() => {
    // Load cache stats
    getImageCacheStats().then(setCacheStats);
    setLastDownload(getLastDownloadTime());
  }, []);

  const handleLanguageToggle = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const handleReloadSeed = async () => {
    try {
      await reloadAllData();
      toast.success(t('تم تحميل 242 بوكيمون!', '242 Pokémon loaded!'));
    } catch (error) {
      console.error('Reload error:', error);
      toast.error(t('حدث خطأ', 'Error occurred'));
    }
  };

  const handleClearData = async () => {
    await clearAllData();
    toast.success(t('تم حذف كل البيانات', 'All data cleared'));
  };

  const handleClearImageCache = async () => {
    await clearImageCache();
    setCacheStats({ count: 0, sizeBytes: 0 });
    setLastDownload(null);
    toast.success(t('تم مسح ذاكرة الصور', 'Image cache cleared'));
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

  const handleDownloadComplete = () => {
    getImageCacheStats().then(setCacheStats);
    setLastDownload(getLastDownloadTime());
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
          {/* Cloud Sync */}
          <CloudSyncCard />

          {/* AI Features */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">{t('المساعد الذكي', 'AI Assistant')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('الدردشة، مستشار الحركات، ومساعد الصيد', 'Chat, move advisor, and catch helper')}
                  </div>
                </div>
              </div>
              <Switch
                checked={aiEnabled}
                onCheckedChange={setAiEnabled}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              {t(
                'يتطلب إعداد LOVABLE_API_KEY في Supabase Edge Functions لتفعيل الإجابات.',
                'Requires LOVABLE_API_KEY to be set in Supabase Edge Functions to receive responses.',
              )}
            </p>
          </div>

          {/* Offline Download Manager */}
          <OfflineDownloadManager onComplete={handleDownloadComplete} />

          {/* Offline Storage Info */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="w-5 h-5 text-accent" />
              <div className="font-medium">{t('التخزين المحلي', 'Offline Storage')}</div>
            </div>
            
            <div className="space-y-3">
              {/* Image cache stats */}
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{t('ذاكرة الصور', 'Image Cache')}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {cacheStats ? (
                    <>
                      {cacheStats.count} {t('صورة', 'images')} • {formatBytes(cacheStats.sizeBytes)}
                    </>
                  ) : (
                    t('جاري التحميل...', 'Loading...')
                  )}
                </div>
              </div>

              {/* Clear cache button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!cacheStats || cacheStats.count === 0}
                  >
                    <Trash2 className="w-4 h-4 me-2" />
                    {t('مسح ذاكرة الصور', 'Clear Image Cache')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('مسح ذاكرة الصور؟', 'Clear Image Cache?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t(
                        'سيتم حذف جميع الصور المحفوظة محلياً. ستحتاج لإعادة التحميل للعمل بدون اتصال.',
                        'All locally saved images will be deleted. You will need to re-download for offline use.'
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('إلغاء', 'Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearImageCache}>
                      {t('مسح', 'Clear')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full col-span-2"
                  >
                    <Trash2 className="w-4 h-4 me-2" />
                    {t('حذف كل البيانات', 'Clear All Data')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('حذف كل البيانات؟', 'Clear All Data?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t(
                        'سيتم حذف جميع البيانات بما في ذلك البوكيمون والحركات والعناصر. لا يمكن التراجع عن هذا الإجراء.',
                        'All data including Pokémon, moves, and items will be deleted. This action cannot be undone.'
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('إلغاء', 'Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearData}>
                      {t('حذف', 'Delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* App Info */}
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gradient mb-1">PLA Dex X</div>
            <div className="text-sm text-muted-foreground">
              {t('دليل بوكيمون أركيوس', 'Pokémon Legends: Arceus Guide')}
            </div>
            <div className="text-xs text-muted-foreground mt-2">v1.1.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
