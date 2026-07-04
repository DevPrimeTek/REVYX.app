'use client';

import { useI18n } from '@/lib/i18n';

export function How() {
  const { t } = useI18n();
  return (
    <section className="container-x py-sp10">
      <p className="eyebrow">{t.how.eyebrow}</p>
      <h2 className="mt-sp2 text-[clamp(28px,4vw,44px)] leading-tight">{t.how.title}</h2>
      <div className="mt-sp5 grid gap-sp3 md:grid-cols-3">
        {t.how.steps.map((s) => (
          <div key={s.n} className="card">
            <span className="font-display text-4xl text-gold">{s.n}</span>
            <h3 className="mt-sp2 font-body text-lg font-bold text-text-h">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
