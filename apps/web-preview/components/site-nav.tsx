'use client';

// M0.S6 · Primary nav with Tutorial + Cabinet submenu · 🌐 Web only.
// Static (non-interactive) elements respect Regula 12 — only interactive items get hover.

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { SUPPORTED_LOCALES, useT, type Locale } from '@/components/i18n/provider';

const primaryLinks = [
  { href: '/dashboard', key: 'dashboard' },
  { href: '/leads', key: 'leads' },
  { href: '/properties', key: 'properties' },
  { href: '/deals', key: 'deals' },
  { href: '/tutorial', key: 'tutorial' },
] as const;

const cabinetLinks = [
  { href: '/cabinet/agent', key: 'cabinetAgent' },
  { href: '/cabinet/agency', key: 'cabinetAgency' },
  { href: '/cabinet/group', key: 'cabinetGroup' },
] as const;

const overflowLinks = [
  { href: '/manager', key: 'manager' },
  { href: '/admin', key: 'admin' },
] as const;

const localeLabels: Record<Locale, string> = { ro: 'RO', ru: 'RU', en: 'EN' };

export function SiteNav({ active }: { active?: string }) {
  const { t, locale, setLocale } = useT();
  const [langOpen, setLangOpen] = useState(false);
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const cabinetRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (cabinetRef.current && !cabinetRef.current.contains(e.target as Node)) setCabinetOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLangOpen(false);
        setCabinetOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const cabinetActive = active?.startsWith('/cabinet');

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-30 h-14 px-sp4 flex items-center justify-between border-b border-border bg-navy-deep/95 backdrop-blur-md"
    >
      <Link href="/dashboard" className="flex items-center gap-sp2">
        <span className="font-display text-[22px] tracking-wide text-gold">REVYX</span>
        <span className="label-mono hidden md:inline">{t('nav.brandTagline')}</span>
      </Link>
      <ul className="hidden lg:flex items-center gap-sp1">
        {primaryLinks.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={cn(
                'inline-flex h-9 items-center px-sp3 rounded-md text-[13px] transition-colors duration-fast',
                active === l.href
                  ? 'bg-navy-hover text-text-h'
                  : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
              )}
            >
              {t(`nav.${l.key}`)}
            </Link>
          </li>
        ))}

        {/* Cabinet dropdown */}
        <li ref={cabinetRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={cabinetOpen}
            onClick={() => setCabinetOpen((o) => !o)}
            className={cn(
              'inline-flex h-9 items-center gap-1 px-sp3 rounded-md text-[13px] transition-colors duration-fast',
              cabinetActive
                ? 'bg-navy-hover text-text-h'
                : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
            )}
          >
            {t('nav.cabinet')}
            <span aria-hidden className="text-text-muted">▾</span>
          </button>
          {cabinetOpen && (
            <ul
              role="menu"
              className="absolute right-0 mt-sp1 min-w-[200px] bg-navy-deep border border-border rounded-md shadow-lg overflow-hidden z-40"
            >
              {cabinetLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    role="menuitem"
                    onClick={() => setCabinetOpen(false)}
                    className={cn(
                      'block px-sp3 py-sp2 text-[13px] transition-colors duration-fast',
                      active === l.href
                        ? 'bg-navy-hover text-gold'
                        : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
                    )}
                  >
                    {t(`nav.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        {overflowLinks.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={cn(
                'inline-flex h-9 items-center px-sp3 rounded-md text-[13px] transition-colors duration-fast',
                active === l.href
                  ? 'bg-navy-hover text-text-h'
                  : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
              )}
            >
              {t(`nav.${l.key}`)}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-sp2">
        <span className="badge-mono text-text-muted hidden md:inline">{t('common.demoBadge')}</span>

        <div ref={langRef} className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            aria-label={t('nav.languageLabel')}
            onClick={() => setLangOpen((o) => !o)}
            className="inline-flex h-9 items-center gap-sp1 px-sp2 rounded-md border border-border-light text-[12px] font-mono text-text-h hover:bg-navy-hover transition-colors duration-fast focus-visible:outline-none focus-visible:border-gold"
          >
            <span className="text-gold">{localeLabels[locale]}</span>
            <span className="text-text-muted" aria-hidden>▾</span>
          </button>
          {langOpen && (
            <ul
              role="listbox"
              aria-label={t('nav.languageLabel')}
              className="absolute right-0 mt-sp1 min-w-[120px] bg-navy-deep border border-border rounded-md shadow-lg overflow-hidden z-40"
            >
              {SUPPORTED_LOCALES.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={locale === l}
                    onClick={() => {
                      setLocale(l);
                      setLangOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-sp3 py-sp2 text-[13px] transition-colors duration-fast',
                      locale === l ? 'bg-navy-hover text-gold' : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
                    )}
                  >
                    <span className="font-mono">{localeLabels[l]}</span>
                    <span className="text-[11px] text-text-muted">{l.toUpperCase()}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          href="/login"
          className="inline-flex h-9 items-center px-sp3 rounded-md border border-border-light text-[13px] text-text-h hover:bg-navy-hover transition-colors duration-fast"
        >
          {t('nav.signOut')}
        </Link>
      </div>
    </nav>
  );
}
