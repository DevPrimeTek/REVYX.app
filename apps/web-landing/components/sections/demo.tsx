'use client';

import { ExternalLink } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { DEMO_URL } from '@/lib/config';

export function Demo() {
  const { t } = useI18n();
  return (
    <section id="demo" className="container-x py-sp8">
      <div className="relative overflow-hidden rounded-xl border border-border-gold bg-navy-card p-sp6 md:p-sp10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
        />
        <p className="eyebrow">{t.demo.eyebrow}</p>
        <h2 className="mt-sp2 max-w-2xl text-[clamp(26px,3.5vw,40px)] leading-tight">
          {t.demo.title}
        </h2>
        <p className="mt-sp3 max-w-xl text-base leading-relaxed text-text-primary">{t.demo.body}</p>
        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold mt-sp4 text-base"
        >
          {t.demo.cta} <ExternalLink size={18} />
        </a>
        <p className="mt-sp2 text-xs text-text-muted">{t.demo.note}</p>
      </div>
    </section>
  );
}
