'use client';

import { Gift, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function Bonus() {
  const { t } = useI18n();
  return (
    <section id="bonus" className="border-t border-border bg-navy-deep/40">
      <div className="container-x py-sp10">
        <div className="grid gap-sp6 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-sp1 rounded-pill bg-gold/15 px-sp2 py-1 text-xs font-semibold text-gold">
              <Gift size={14} /> {t.bonus.eyebrow}
            </span>
            <h2 className="mt-sp3 text-[clamp(28px,4vw,44px)] leading-tight">{t.bonus.title}</h2>
            <p className="mt-sp3 text-base leading-relaxed text-text-primary">{t.bonus.body}</p>
            <a href="#feedback" className="btn-gold mt-sp4 text-base">
              {t.bonus.cta}
            </a>
          </div>
          <ul className="grid gap-sp2">
            {t.bonus.points.map((p, i) => (
              <li key={i} className="card flex gap-sp2">
                <Check size={20} className="mt-0.5 shrink-0 text-status-green" />
                <span className="text-sm leading-relaxed text-text-primary">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
