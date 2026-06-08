'use client';

// Val 2 (AGI §17.5) · Indicator compact în lista de lead-uri — semnalează că un lead
// supply (vânzător/proprietar) are mandat de semnat / expirat. În unison cu badge-urile
// existente. Apare DOAR pentru supply leads care necesită acțiune (none/pending/expired).

import { Badge } from '@/components/ui/badge';
import { useT } from '@/components/i18n/provider';
import { useMandate, effectiveStatus } from '@/lib/mandate-store';
import { isSupplySide } from '@/lib/transaction-intent';
import type { Lead } from '@/lib/mock';

export function MandateFlag({ lead }: { lead: Lead }) {
  const { t } = useT();
  const m = useMandate(lead.id);
  // Doar supply (seller/landlord) au mandat.
  if (!isSupplySide(lead.leadType)) return null;
  const status = effectiveStatus(m);
  // Semnat → fără zgomot vizual (nimic de acționat).
  if (status === 'signed') return null;

  const isExpired = status === 'expired';
  return (
    <Badge
      variant={isExpired ? 'critical' : 'warning'}
      size="xs"
      className="ml-sp1 inline-flex items-center gap-0.5"
      title={t(isExpired ? 'mandate.flagExpiredHint' : 'mandate.flagHint')}
    >
      <span aria-hidden>✎</span>
      {t(isExpired ? 'mandate.flagExpired' : 'mandate.flag')}
    </Badge>
  );
}
