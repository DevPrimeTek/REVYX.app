'use client';

// M0.S6 · /tutorial · single-page guide explaining every screen.
// For the production MVP (M1.S5) we'll add per-screen <TutorialOverlay> per Regula 13.

import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useT } from '@/components/i18n/provider';

const SECTIONS = [
  { id: 'dashboard', href: '/dashboard' },
  { id: 'leads', href: '/leads' },
  { id: 'leadDetail', href: '/leads/L-1001' },
  { id: 'properties', href: '/properties' },
  { id: 'deals', href: '/deals' },
  { id: 'cabinet', href: '/cabinet/agent' },
  { id: 'scoringEngines', href: null },
  { id: 'tutorialFuture', href: null },
] as const;

export default function TutorialPage() {
  const { t } = useT();
  return (
    <>
      <SiteNav active="/tutorial" />
      <main id="main" className="px-sp4 py-sp4 lg:px-sp6 max-w-4xl mx-auto flex flex-col gap-sp4">
        <header>
          <p className="label-mono text-gold">{t('tutorial.moduleLabel')}</p>
          <h1 className="text-[28px] mt-sp1">{t('tutorial.title')}</h1>
          <p className="text-[13px] text-text-secondary mt-sp1">{t('tutorial.subtitle')}</p>
        </header>

        <Card variant="elevated" accentTop>
          <CardContent className="pt-sp3">
            <p className="text-[14px] text-text-h leading-relaxed">{t('tutorial.intro')}</p>
          </CardContent>
        </Card>

        <nav aria-label="Tutorial sections" className="flex flex-wrap gap-sp2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex h-8 items-center px-sp3 rounded-pill border border-border-light text-[12px] text-text-secondary hover:text-gold hover:border-gold transition-colors duration-fast"
            >
              {t(`tutorial.sections.${s.id}.title`)}
            </a>
          ))}
        </nav>

        <section className="flex flex-col gap-sp3">
          {SECTIONS.map((s, i) => (
            <Card key={s.id} id={s.id} className="scroll-mt-20">
              <CardHeader>
                <p className="label-mono text-text-secondary">
                  {String(i + 1).padStart(2, '0')} / {SECTIONS.length}
                </p>
                <CardTitle>{t(`tutorial.sections.${s.id}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {t(`tutorial.sections.${s.id}.body`)}
                </p>
                {s.href && (
                  <p className="mt-sp3">
                    <Link
                      href={s.href}
                      className="inline-flex items-center text-[12px] text-gold hover:underline underline-offset-4"
                    >
                      {t('common.open')} →
                    </Link>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
}
