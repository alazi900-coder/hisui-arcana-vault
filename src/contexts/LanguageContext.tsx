import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/db';

export type Language = 'ar' | 'en' | 'ja';

export const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
];

/**
 * Translate a key. The legacy two-arg shape `t(ar, en)` keeps working;
 * pass a third `ja` argument to opt a string into Japanese support.
 * When the current language is `ja` but no Japanese was provided, we
 * fall back to English (never Arabic) to avoid mixed-script UI.
 */
export function translate(lang: Language, ar: string, en: string, ja?: string): string {
  if (lang === 'ar') return ar;
  if (lang === 'ja') return ja ?? en;
  return en;
}

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (ar: string, en: string, ja?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');

  useEffect(() => {
    getSettings().then(s => {
      const stored = s.language as Language;
      if (stored === 'ar' || stored === 'en' || stored === 'ja') {
        setLangState(stored);
      }
    });
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    updateSettings({ language: newLang });
  };

  const t = (ar: string, en: string, ja?: string) => translate(lang, ar, en, ja);
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
