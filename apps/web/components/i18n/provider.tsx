'use client';

// M0.S3 · T-M0.S3-11..13 · Lightweight client-side i18n · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// Roadmap ref: docs/ROADMAP_REVYX_detailed-execution_v1.0.3.md §3.3 T-M0.S3-11..13
//
// Design note: we deliberately avoid next-intl's [locale]/ route segmenting to keep
// all routes statically prerendered for the demo. Locale is held in React context +
// persisted to localStorage. SSR renders the default ("ro"); the provider hydrates
// the stored locale on mount.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import ro from '@/messages/ro.json';
import ru from '@/messages/ru.json';
import en from '@/messages/en.json';

export type Locale = 'ro' | 'ru' | 'en';

const catalogs = { ro, ru, en } as const;
export const SUPPORTED_LOCALES: readonly Locale[] = ['ro', 'ru', 'en'] as const;
const STORAGE_KEY = 'revyx.locale';

type Messages = typeof ro;

type I18nCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  messages: Messages;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object' && k in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[k];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ro');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && SUPPORTED_LOCALES.includes(stored)) {
        setLocaleState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      // ignore (private mode, SSR, etc.)
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    } catch {
      // ignore
    }
  }, []);

  const messages = catalogs[locale] as Messages;

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const v = getByPath(messages, key);
      if (typeof v === 'string') return interpolate(v, vars);
      // fallback: try RO catalog so a missing key never crashes the demo
      const fallback = getByPath(ro, key);
      if (typeof fallback === 'string') return interpolate(fallback, vars);
      return key;
    },
    [messages]
  );

  const value = useMemo<I18nCtx>(() => ({ locale, setLocale, messages, t }), [locale, setLocale, messages, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useT() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useT must be used inside <I18nProvider>');
  return ctx;
}
