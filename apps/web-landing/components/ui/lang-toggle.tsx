'use client';

import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/cn';

export function LangToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="inline-flex overflow-hidden rounded-pill border border-border">
      {(['ro', 'ru'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            'px-2.5 py-1 text-xs font-semibold uppercase transition-colors duration-fast',
            locale === l
              ? 'bg-gold text-navy-deep'
              : 'text-text-secondary hover:text-text-h',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
