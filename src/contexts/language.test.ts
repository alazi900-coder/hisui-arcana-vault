import { describe, expect, it } from 'vitest';
import { LANGUAGE_OPTIONS, translate, type Language } from './LanguageContext';

describe('translate', () => {
  it('returns Arabic when lang=ar', () => {
    expect(translate('ar', 'مرحبا', 'hello', 'こんにちは')).toBe('مرحبا');
  });

  it('returns English when lang=en', () => {
    expect(translate('en', 'مرحبا', 'hello', 'こんにちは')).toBe('hello');
  });

  it('returns Japanese when lang=ja and ja is provided', () => {
    expect(translate('ja', 'مرحبا', 'hello', 'こんにちは')).toBe('こんにちは');
  });

  it('falls back to English when lang=ja but no Japanese given', () => {
    expect(translate('ja', 'مرحبا', 'hello')).toBe('hello');
  });

  it('ignores ja for non-Japanese languages', () => {
    expect(translate('en', 'A', 'B', 'C')).toBe('B');
    expect(translate('ar', 'A', 'B', 'C')).toBe('A');
  });
});

describe('LANGUAGE_OPTIONS', () => {
  it('exposes exactly the three supported languages', () => {
    const codes = LANGUAGE_OPTIONS.map(o => o.code as Language);
    expect(codes).toEqual(['ar', 'en', 'ja']);
  });

  it('uses native-script labels', () => {
    expect(LANGUAGE_OPTIONS.find(o => o.code === 'ar')?.label).toBe('العربية');
    expect(LANGUAGE_OPTIONS.find(o => o.code === 'ja')?.label).toBe('日本語');
  });
});
