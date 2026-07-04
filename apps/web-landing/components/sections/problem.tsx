'use client';

import { AlertTriangle } from 'lucide-react';
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
        <ul className="mt-sp5 grid gap-sp3 md:grid-cols-3">
          {t.problem.items.map((item, i) => (
            <li key={i} className="card flex gap-sp2">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-status-amber" />
              <span className="text-sm leading-relaxed text-text-primary">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
