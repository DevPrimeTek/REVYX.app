'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useT } from '@/components/i18n/provider';

export default function HomePage() {
  const { t } = useT();
  return (
    <main id="main" className="min-h-screen flex flex-col items-center justify-center px-sp4 py-sp8">
      <div className="absolute inset-0 grid-overlay pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 max-w-3xl text-center flex flex-col gap-sp4">
        <p className="label-mono text-gold">M0.S3 · Web Static Demo</p>
        <h1 className="font-display text-[clamp(56px,10vw,120px)] leading-none text-text-h">
          REVYX
        </h1>
        <p className="text-[18px] text-text-secondary">
          Agent Operating System (AOS) · <span className="text-text-h">{t('nav.brandTagline')}</span>
        </p>
        <p className="text-[13px] text-text-muted">
          Demo public · mock data (100 leads / 50 proprietăți / 20 deal-uri) · drag-drop kanban ·
          i18n RO / RU / EN.
        </p>
        <div className="flex items-center justify-center gap-sp2 pt-sp2 flex-wrap">
          <Link href="/login">
            <Button size="lg">{t('login.continue')}</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              {t('nav.dashboard')} →
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
