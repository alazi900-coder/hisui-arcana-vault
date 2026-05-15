import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Cloud, CloudUpload, CloudDownload, LogIn, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { db } from '@/lib/db';
import { pullTable, pushTable, SYNC_TABLES, type SyncTableName } from '@/lib/cloud-sync';

function getTable(name: SyncTableName) {
  switch (name) {
    case 'favorites': return db.favorites;
    case 'livingDex': return db.livingDex;
    case 'outbreaks': return db.outbreaks;
    case 'inventory': return db.inventory;
  }
}

export function CloudSyncCard() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState<null | 'push' | 'pull'>(null);

  const run = async (direction: 'push' | 'pull') => {
    if (!user) return;
    setBusy(direction);
    try {
      const results = [];
      for (const name of SYNC_TABLES) {
        const table = getTable(name);
        const op = direction === 'push' ? pushTable : pullTable;
        // Bulk operations may include foreign keys; we treat each table independently.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        results.push(await op(supabase, user.id, name, table as any));
      }
      const total = results.reduce((sum, r) => sum + r.rows, 0);
      toast.success(
        direction === 'push'
          ? t(`تم رفع ${total} عنصر إلى السحابة`, `Pushed ${total} items to cloud`)
          : t(`تم تنزيل ${total} عنصر من السحابة`, `Pulled ${total} items from cloud`),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(t(`فشلت المزامنة: ${msg}`, `Sync failed: ${msg}`));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Cloud className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{t('المزامنة السحابية', 'Cloud Sync')}</h3>
          <p className="text-xs text-muted-foreground">
            {t('المفضلة + Living Dex + الانتشارات + المخزون', 'Favorites + Living Dex + Outbreaks + Inventory')}
          </p>
        </div>
      </div>

      {!user ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t(
              'سجّل الدخول لمزامنة تقدّمك عبر أجهزتك. كل البيانات المحلية تبقى كما هي.',
              "Sign in to keep your progress synced across devices. Your local data isn't touched.",
            )}
          </p>
          <Link to="/auth">
            <Button className="w-full">
              <LogIn className="w-4 h-4 me-2" />
              {t('سجّل الدخول / أنشئ حساباً', 'Sign in / Sign up')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg bg-secondary/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">{t('المسجَّل', 'Signed in as')}: </span>
            <span className="font-mono truncate">{user.email}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => run('push')} disabled={!!busy}>
              {busy === 'push' ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <CloudUpload className="w-4 h-4 me-2" />}
              {t('رفع', 'Push')}
            </Button>
            <Button variant="outline" onClick={() => run('pull')} disabled={!!busy}>
              {busy === 'pull' ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <CloudDownload className="w-4 h-4 me-2" />}
              {t('تنزيل', 'Pull')}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={async () => {
              await signOut();
              toast.success(t('تم تسجيل الخروج', 'Signed out'));
            }}
          >
            <LogOut className="w-3.5 h-3.5 me-2" />
            {t('تسجيل الخروج', 'Sign out')}
          </Button>

          <p className="text-[11px] text-muted-foreground">
            {t(
              'الرفع يستبدل النسخة السحابية. التنزيل يستبدل النسخة المحلية. اختَر بحذر.',
              'Push overwrites cloud copy. Pull overwrites local copy. Choose carefully.',
            )}
          </p>
        </div>
      )}
    </div>
  );
}
