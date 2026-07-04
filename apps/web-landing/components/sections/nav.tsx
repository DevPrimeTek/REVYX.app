'use client';

import { useI18n } from '@/lib/i18n';
import { DEMO_URL } from '@/lib/config';
import { Logo } from '@/components/ui/logo';
import { LangToggle } from '@/components/ui/lang-toggle';

export function Nav() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-navy-deep/85 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between gap-sp3">
        <a href="#top" aria-label="REVYX" className="shrink-0">
          <Logo />
        </a>
        <div className="hidden items-center gap-sp4 md:flex">
          <a href="#benefits" className="text-sm text-text-secondary hover:text-text-h">
            {t.nav.benefits}
          </a>
          <a href="#bonus" className="text-sm text-text-secondary hover:text-text-h">
            {t.nav.bonus}
          </a>
          <a href="#feedback" className="text-sm text-text-secondary hover:text-text-h">
            {t.nav.feedback}
          </a>
        </div>
        <div className="flex items-center gap-sp2">
          <LangToggle />
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold hidden sm:inline-flex"
          >
            {t.nav.cta}
          </a>
        </div>
      </nav>
    </header>
  );
}
