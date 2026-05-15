import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, LogIn, UserPlus, Mail, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Mode = 'signin' | 'signup' | 'magic';

export default function Auth() {
  const { t } = useLanguage();
  const { user, loading: authLoading, signInWithPassword, signUpWithPassword, signInWithMagicLink } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/settings" replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    if (mode === 'magic') {
      const { error } = await signInWithMagicLink(email);
      setSubmitting(false);
      if (error) toast.error(error);
      else toast.success(t('تحقق من بريدك للرابط السحري', 'Magic link sent — check your inbox'));
      return;
    }

    if (!password) {
      setSubmitting(false);
      return;
    }
    const fn = mode === 'signin' ? signInWithPassword : signUpWithPassword;
    const { error } = await fn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (mode === 'signup') {
      toast.success(t('تم إنشاء الحساب — تحقق من بريدك إن لزم', 'Account created — check your inbox if confirmation is required'));
    } else {
      toast.success(t('تم تسجيل الدخول', 'Signed in'));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass rounded-2xl p-6 w-full max-w-md space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gradient">
            {t('حسابك السحابي', 'Your Cloud Account')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t(
              'سجّل الدخول لمزامنة الفريق، المفضلة، الـ Living Dex والانتشارات عبر أجهزتك.',
              'Sign in to sync your team, favorites, Living Dex and outbreaks across devices.',
            )}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-secondary/30 rounded-lg p-1 text-sm">
          {(['signin', 'signup', 'magic'] as Mode[]).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'rounded-md py-1.5 font-medium transition-colors',
                mode === m ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary',
              )}
            >
              {m === 'signin' && t('دخول', 'Sign In')}
              {m === 'signup' && t('إنشاء حساب', 'Sign Up')}
              {m === 'magic' && t('رابط سحري', 'Magic Link')}
            </button>
          ))}
        </div>

        <form className="space-y-3" onSubmit={submit}>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              {t('البريد الإلكتروني', 'Email')}
            </label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="ps-9"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {mode !== 'magic' && (
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                {t('كلمة المرور', 'Password')}
              </label>
              <div className="relative">
                <KeyRound className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="ps-9"
                  placeholder="••••••••"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-[11px] text-muted-foreground mt-1">
                  {t('6 أحرف على الأقل', 'At least 6 characters')}
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 me-2 animate-spin" />}
            {!submitting && mode === 'signin' && <LogIn className="w-4 h-4 me-2" />}
            {!submitting && mode === 'signup' && <UserPlus className="w-4 h-4 me-2" />}
            {!submitting && mode === 'magic' && <Mail className="w-4 h-4 me-2" />}
            {mode === 'signin' && t('دخول', 'Sign In')}
            {mode === 'signup' && t('إنشاء حساب', 'Create Account')}
            {mode === 'magic' && t('أرسِل الرابط', 'Send Magic Link')}
          </Button>
        </form>

        <p className="text-[11px] text-muted-foreground text-center">
          {t(
            'بياناتك المحلية لن تُمسح أبداً — المزامنة اختيارية بالكامل.',
            'Your local data is never wiped — sync is fully opt-in.',
          )}
        </p>
      </div>
    </div>
  );
}
