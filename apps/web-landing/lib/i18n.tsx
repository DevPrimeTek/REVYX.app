'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { content, type Copy, type Locale } from './content';

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Copy;
}

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = 'revyx.landing.locale';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ro');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ro' || saved === 'ru') setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: content[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
