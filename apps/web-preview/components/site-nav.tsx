'use client';

// M0.S6 · Primary nav with Tutorial + Cabinet submenu · 🌐 Web only.
// Static (non-interactive) elements respect Regula 12 — only interactive items get hover.
// Tablet/mobile (< xl / 1280px): desktop bar collapses into a hamburger +
// slide-in drawer so navigation stays reachable on phones (Samsung S22 ~360px)
// and tablets (Xiaomi Pad ~800px portrait / ~1280px landscape). The inline bar
// only fits without overflow at ≥1280px, so it returns at `xl`.

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { SUPPORTED_LOCALES, useT, type Locale } from '@/components/i18n/provider';

const primaryLinks = [
  { href: '/dashboard', key: 'dashboard' },
  { href: '/leads', key: 'leads' },
  { href: '/properties', key: 'properties' },
  { href: '/deals', key: 'deals' },
  { href: '/showings', key: 'showings' },
  { href: '/tasks', key: 'tasks' },
] as const;

const cabinetLinks = [
  { href: '/cabinet/agent', key: 'cabinetAgent' },
  { href: '/cabinet/agency', key: 'cabinetAgency' },
  { href: '/cabinet/group', key: 'cabinetGroup' },
] as const;

// Audit UX fix: Manager + Admin mutate în „Mai mult" ca bara să încapă pe laptop-uri
// 1280/1366 (anterior 10 iteme inline → overflow orizontal 143px la 1280).
const toolsLinks = [
  { href: '/manager', key: 'manager' },
  { href: '/admin', key: 'admin' },
  { href: '/marketplace', key: 'marketplace' },
  { href: '/notary', key: 'notary' },
  { href: '/client', key: 'clientPortal' },
  { href: '/intake', key: 'intake' },
  { href: '/tutorial', key: 'tutorial' },
] as const;

const localeLabels: Record<Locale, string> = { ro: 'RO', ru: 'RU', en: 'EN' };

export function SiteNav({ active }: { active?: string }) {
  const { t, locale, setLocale } = useT();
  const [langOpen, setLangOpen] = useState(false);
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const cabinetRef = useRef<HTMLLIElement>(null);
  const toolsRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (cabinetRef.current && !cabinetRef.current.contains(e.target as Node)) setCabinetOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLangOpen(false);
        setCabinetOpen(false);
        setToolsOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const cabinetActive = active?.startsWith('/cabinet');
  const toolsActive = toolsLinks.some((l) => active === l.href);

  return (
    <>
    <nav
      aria-label="Primary"
      className="sticky top-0 z-30 h-14 px-sp4 flex items-center justify-between border-b border-border bg-navy-deep/95 backdrop-blur-md"
    >
      <Link href="/dashboard" className="flex items-center gap-sp2">
        <span className="font-display text-[22px] tracking-wide text-gold">REVYX</span>
        <span className="label-mono hidden 2xl:inline whitespace-nowrap">{t('nav.brandTagline')}</span>
      </Link>
      <ul className="hidden xl:flex items-center gap-sp1">
        {primaryLinks.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={cn(
                'inline-flex h-9 items-center whitespace-nowrap shrink-0 px-sp2 rounded-md text-[13px] transition-colors duration-fast',
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
              'inline-flex h-9 items-center gap-1 whitespace-nowrap shrink-0 px-sp2 rounded-md text-[13px] transition-colors duration-fast',
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

        {/* Tools dropdown */}
        <li ref={toolsRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={toolsOpen}
            onClick={() => setToolsOpen((o) => !o)}
            className={cn(
              'inline-flex h-9 items-center gap-1 whitespace-nowrap shrink-0 px-sp2 rounded-md text-[13px] transition-colors duration-fast',
              toolsActive
                ? 'bg-navy-hover text-text-h'
                : 'text-text-secondary hover:bg-navy-hover hover:text-text-h'
            )}
          >
            {t('nav.tools')}
            <span aria-hidden className="text-text-muted">▾</span>
          </button>
          {toolsOpen && (
            <ul
              role="menu"
              className="absolute right-0 mt-sp1 min-w-[220px] bg-navy-deep border border-border rounded-md shadow-lg overflow-hidden z-40"
            >
              {toolsLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    role="menuitem"
                    onClick={() => setToolsOpen(false)}
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
          className="hidden sm:inline-flex h-9 items-center px-sp3 rounded-md border border-border-light text-[13px] text-text-h hover:bg-navy-hover transition-colors duration-fast"
        >
          {t('nav.signOut')}
        </Link>

        {/* Hamburger — tablet/mobile only (desktop uses the inline bar above) */}
        <button
          type="button"
          aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.menu')}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((o) => !o)}
          className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border-light text-text-h hover:bg-navy-hover transition-colors duration-fast"
        >
          <span className="sr-only">{mobileOpen ? t('nav.closeMenu') : t('nav.menu')}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {mobileOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
    </nav>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        active={active}
      />
    </>
  );
}

// Mobile / tablet slide-in navigation drawer (< xl). Renders every destination
// grouped by section so nothing is unreachable on small screens.
function MobileDrawer({
  open,
  onClose,
  active,
}: {
  open: boolean;
  onClose: () => void;
  active?: string;
}) {
  const { t } = useT();

  const sections = [
    { title: undefined, links: primaryLinks },
    { title: t('nav.cabinet'), links: cabinetLinks },
    { title: t('nav.tools'), links: toolsLinks },
  ] as const;

  return (
    // Viewport-pinned clip layer: `overflow-hidden` keeps the off-canvas panel
    // (translate-x-full when closed) from adding horizontal scroll to the page.
    <div
      aria-hidden={!open}
      className={cn(
        'xl:hidden fixed inset-0 top-14 z-40 overflow-hidden',
        open ? '' : 'pointer-events-none',
      )}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          'absolute inset-0 bg-navy-deep/70 backdrop-blur-sm transition-opacity duration-normal',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/* Panel */}
      <div
        id="mobile-nav"
        role="menu"
        aria-label={t('nav.menu')}
        className={cn(
          'absolute right-0 top-0 bottom-0 w-[min(84vw,320px)] flex flex-col overflow-y-auto',
          'border-l border-border bg-navy-deep shadow-lg transition-transform duration-normal ease-decel',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <nav className="flex flex-col gap-sp4 px-sp4 py-sp4">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-sp1">
              {section.title && (
                <p className="label-mono px-sp2 pb-sp1 text-text-muted">{section.title}</p>
              )}
              {section.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  role="menuitem"
                  onClick={onClose}
                  className={cn(
                    'flex h-11 items-center rounded-md px-sp3 text-[15px] transition-colors duration-fast',
                    active === l.href
                      ? 'bg-navy-hover text-gold font-semibold'
                      : 'text-text-secondary hover:bg-navy-hover hover:text-text-h',
                  )}
                >
                  {t(`nav.${l.key}`)}
                </Link>
              ))}
            </div>
          ))}

          <Link
            href="/login"
            role="menuitem"
            onClick={onClose}
            className="mt-sp2 flex h-11 items-center justify-center rounded-md border border-border-light px-sp3 text-[15px] text-text-h hover:bg-navy-hover transition-colors duration-fast"
          >
            {t('nav.signOut')}
          </Link>
        </nav>
      </div>
    </div>
  );
}
