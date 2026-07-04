'use client';

import { ArrowRight, PlayCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { DEMO_URL } from '@/lib/config';

export function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-x py-sp12 md:py-sp16">
        <span className="inline-flex items-center gap-sp1 rounded-pill border border-border-gold-pale bg-navy-card px-sp2 py-1 text-xs font-semibold text-gold">
          {t.hero.badge}
        </span>
        <h1 className="mt-sp4 max-w-3xl text-[clamp(44px,8vw,88px)] leading-[0.95]">
          <span className="text-text-h">{t.hero.title1}</span>{' '}
          <span className="text-gold">{t.hero.title2}</span>
        </h1>
        <p className="mt-sp4 max-w-2xl text-base leading-relaxed text-text-primary md:text-lg">
          {t.hero.subtitle}
        </p>
        <div className="mt-sp5 flex flex-wrap items-center gap-sp2">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-base"
          >
            <PlayCircle size={18} /> {t.hero.ctaDemo}
          </a>
          <a href="#feedback" className="btn-ghost text-base">
            {t.hero.ctaFeedback} <ArrowRight size={18} />
          </a>
        </div>
        <p className="mt-sp4 font-mono text-xs uppercase tracking-badge text-text-muted">
          {t.hero.trust}
        </p>
      </div>
    </section>
  );
}
