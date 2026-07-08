'use client';

import { Compass, ListChecks, TrendingUp } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ICONS = [Compass, ListChecks, TrendingUp];

export function Pillars() {
  const { t } = useI18n();
  return (
    <section id="pillars" className="border-t border-border bg-navy-deep/40">
      <div className="container-x py-sp10">
        <p className="eyebrow">{t.pillars.eyebrow}</p>
        <h2 className="mt-sp2 text-[clamp(28px,4vw,44px)] leading-tight">{t.pillars.title}</h2>
        <div className="mt-sp5 grid gap-sp3 md:grid-cols-3">
          {t.pillars.blocks.map((block, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={i} className="card">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-navy-hover text-gold">
                  <Icon size={22} />
                </span>
                <h3 className="mt-sp3 font-body text-xl font-bold text-text-h">{block.title}</h3>
                <p className="mt-sp1 text-sm leading-relaxed text-text-secondary">{block.body}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-sp5 max-w-2xl font-mono text-xs uppercase tracking-badge text-text-muted">
          {t.pillars.note}
        </p>
      </div>
    </section>
  );
}
