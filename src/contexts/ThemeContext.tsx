import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getSettings, updateSettings } from '@/lib/db';
import type { ThemeName } from '@/types/pokemon';

export const THEME_OPTIONS: readonly ThemeName[] = ['dark', 'light', 'midnight'];

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (next: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Apply a theme by setting `data-theme` on <html>. CSS overrides in
 * index.css drive every Tailwind color variable from there. We always
 * keep `color-scheme: dark` on the cosmic theme and switch it to `light`
 * for the light theme so browser-rendered widgets (scrollbars, native
 * controls) follow along.
 */
export function applyThemeToDocument(theme: ThemeName) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('dark');

  useEffect(() => {
    let cancelled = false;
    getSettings().then(s => {
      if (cancelled) return;
      const stored: ThemeName = (THEME_OPTIONS as readonly string[]).includes(s.theme)
        ? (s.theme as ThemeName)
        : 'dark';
      setThemeState(stored);
      applyThemeToDocument(stored);
    });
    return () => { cancelled = true; };
  }, []);

  const setTheme = (next: ThemeName) => {
    setThemeState(next);
    applyThemeToDocument(next);
    updateSettings({ theme: next });
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
