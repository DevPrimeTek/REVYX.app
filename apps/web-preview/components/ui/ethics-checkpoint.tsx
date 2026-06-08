'use client';

// Val 2 (AGI §18.4 Ethics Checkpoints) · Soft-prompt NON-BLOCANT la momente de decizie
// sensibile (NAR/APAIM). Nu blochează operația — agentul confirmă „Am înțeles și am acționat".
// Reutilizabil: dual_representation / competing_offers / property_disclosure /
// financing_gap / exclusive_listing_solicitation / misleading_advertising.

import { acknowledge, useAcknowledged } from '@/lib/ethics-store';
import { useT } from '@/components/i18n/provider';

export function EthicsCheckpoint({
  storageKey,
  trigger,
  narArticle,
}: {
  /** Cheie unică per (entitate, trigger) — ex: `prop-P-1901-misleading_advertising`. */
  storageKey: string;
  /** Trigger-ul (cheie i18n sub ethics.trigger.*). */
  trigger: string;
  /** Eticheta articolului NAR (ex: „NAR Art. 12"). */
  narArticle: string;
}) {
  const { t } = useT();
  const acked = useAcknowledged(storageKey);

  return (
    <div
      className={
        'rounded-md border px-sp3 py-sp2 ' +
        (acked ? 'border-status-green/30 bg-status-green/5' : 'border-gold/40 bg-gold/5')
      }
    >
      <div className="flex items-start gap-sp2">
        <span className="text-[15px] leading-none mt-0.5" aria-hidden>
          {acked ? '✓' : '⚖'}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-text-h">
            {t('ethics.label')} · <span className="text-text-muted font-normal">{narArticle}</span>
          </p>
          <p className="text-[12px] text-text-secondary mt-0.5">{t(`ethics.trigger.${trigger}`)}</p>
        </div>
      </div>
      {!acked ? (
        <button
          type="button"
          onClick={() => acknowledge(storageKey)}
          className="mt-sp2 text-[11px] px-sp2 py-1 rounded border border-gold/40 text-gold hover:bg-gold/10 cursor-pointer transition-colors duration-fast"
        >
          {t('ethics.ackCta')}
        </button>
      ) : (
        <p className="mt-sp1 text-[11px] text-status-green">{t('ethics.acked')}</p>
      )}
    </div>
  );
}
