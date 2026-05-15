/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, beforeEach } from 'vitest';
import { applyThemeToDocument, THEME_OPTIONS } from './ThemeContext';

describe('applyThemeToDocument', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
  });

  it('exposes exactly the three theme names', () => {
    expect(THEME_OPTIONS).toEqual(['dark', 'light', 'midnight']);
  });

  it('sets data-theme=light + color-scheme: light for the light theme', () => {
    applyThemeToDocument('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('sets data-theme=midnight + color-scheme: dark for midnight', () => {
    applyThemeToDocument('midnight');
    expect(document.documentElement.getAttribute('data-theme')).toBe('midnight');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('sets data-theme=dark + color-scheme: dark for default dark', () => {
    applyThemeToDocument('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
