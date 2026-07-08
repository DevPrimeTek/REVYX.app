'use client';

import { useI18n } from '@/lib/i18n';

export function Problem() {
  const { t } = useI18n();
  return (
    <section className="border-t border-border bg-navy-deep/40">
      <div className="container-x py-sp10">
        <p className="eyebrow">{t.problem.eyebrow}</p>
        <h2 className="mt-sp2 max-w-3xl text-[clamp(28px,4vw,44px)] leading-tight">
          {t.problem.title}
        </h2>
        <p className="mt-sp3 max-w-2xl text-base leading-relaxed text-text-primary">
          {t.problem.intro}
        </p>
        <div className="mt-sp5 grid gap-sp3 md:grid-cols-3">
          {t.problem.items.map((item, i) => (
            <div key={i} className="card">
              <span className="font-display text-3xl text-gold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-sp2 font-body text-lg font-bold text-text-h">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
