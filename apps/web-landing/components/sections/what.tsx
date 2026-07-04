'use client';

import { useI18n } from '@/lib/i18n';

export function What() {
  const { t } = useI18n();
  return (
    <section className="container-x py-sp10">
      <div className="grid items-center gap-sp6 md:grid-cols-2">
        <div>
          <p className="eyebrow">{t.what.eyebrow}</p>
          <h2 className="mt-sp2 text-[clamp(28px,4vw,44px)] leading-tight">{t.what.title}</h2>
          <p className="mt-sp3 text-base leading-relaxed text-text-primary">{t.what.body}</p>
        </div>
        <div className="card border-l-2 border-l-gold">
          <p className="text-lg font-semibold leading-relaxed text-text-h">
            &ldquo;{t.what.notCrm}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
