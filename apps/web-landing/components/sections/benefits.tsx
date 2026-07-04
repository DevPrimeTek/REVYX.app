'use client';

import { Bell, Compass, Sparkles, GitBranch, KeyRound, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ICONS = [Bell, Compass, Sparkles, GitBranch, KeyRound, Users];

export function Benefits() {
  const { t } = useI18n();
  return (
    <section id="benefits" className="border-t border-border bg-navy-deep/40">
      <div className="container-x py-sp10">
        <p className="eyebrow">{t.benefits.eyebrow}</p>
        <h2 className="mt-sp2 text-[clamp(28px,4vw,44px)] leading-tight">{t.benefits.title}</h2>
        <div className="mt-sp5 grid gap-sp3 sm:grid-cols-2 lg:grid-cols-3">
          {t.benefits.items.map((b, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={i} className="card-hover">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-navy-hover text-gold">
                  <Icon size={20} />
                </span>
                <h3 className="mt-sp2 font-body text-lg font-bold text-text-h">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{b.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
