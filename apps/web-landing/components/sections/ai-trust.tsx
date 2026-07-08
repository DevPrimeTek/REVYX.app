'use client';

import { CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function AiTrust() {
  const { t } = useI18n();
  return (
    <section className="container-x py-sp10">
      <div className="grid items-center gap-sp6 md:grid-cols-2">
        <div>
          <p className="eyebrow">{t.ai.eyebrow}</p>
          <h2 className="mt-sp2 text-[clamp(28px,4vw,44px)] leading-tight">{t.ai.title}</h2>
          <p className="mt-sp3 text-base leading-relaxed text-text-primary">{t.ai.body}</p>
        </div>
        <div className="card border-l-2 border-l-gold">
          <ul className="flex flex-col gap-sp3">
            {t.ai.points.map((point, i) => (
              <li key={i} className="flex items-start gap-sp2">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-base font-semibold leading-relaxed text-text-h">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
