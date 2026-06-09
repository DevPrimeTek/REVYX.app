'use client';

// Val 2 (AGI §17.5) · Indicator compact în lista de lead-uri — semnalează că un lead supply
// (vânzător/proprietar) are mandat de semnat / expirat. ICONIȚĂ document + semnătură (fără text),
// în unison cu designul. Apare DOAR pentru supply leads care necesită acțiune.

import { useT } from '@/components/i18n/provider';
import { useMandate, effectiveStatus } from '@/lib/mandate-store';
import { isSupplySide } from '@/lib/transaction-intent';
import type { Lead } from '@/lib/mock';

/** Document cu linie de semnătură — iconiță simplă. */
function MandateIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
      <path d="M9 1.5H4.2A.7.7 0 0 0 3.5 2.2v11.6a.7.7 0 0 0 .7.7h7.6a.7.7 0 0 0 .7-.7V4.5z" />
      <path d="M9 1.5V4.5h3" />
      <path d="M5.5 11.5c1-1.3 2-1.3 2.6 0 .6 1.3 1.6 1.3 2.4 0" />
    </svg>
  );
}

export function MandateFlag({ lead }: { lead: Lead }) {
  const { t } = useT();
  const m = useMandate(lead.id);
  if (!isSupplySide(lead.leadType)) return null;
  const status = effectiveStatus(m);
  if (status === 'signed') return null; // semnat → fără zgomot vizual

  const isExpired = status === 'expired';
  return (
    <span
      role="img"
      aria-label={t(isExpired ? 'mandate.flagExpiredHint' : 'mandate.flagHint')}
      title={t(isExpired ? 'mandate.flagExpiredHint' : 'mandate.flagHint')}
      className={
        'ml-sp1 inline-flex items-center justify-center w-5 h-5 rounded border align-middle ' +
        (isExpired
          ? 'text-status-red border-status-red/40 bg-status-red/10'
          : 'text-status-amber border-status-amber/40 bg-status-amber/10')
      }
    >
      <MandateIcon />
    </span>
  );
}
