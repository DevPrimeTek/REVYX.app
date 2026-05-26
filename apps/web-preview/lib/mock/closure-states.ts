// M0.S8 · Seed closure states per deal — only deals in closing/won have meaningful state.

import type { ClosureState } from './transactions-types';
import { deals } from './deals';

function iso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}

export function buildSeedClosureStates(): ClosureState[] {
  const out: ClosureState[] = [];

  for (const deal of deals) {
    if (deal.stage === 'closing') {
      out.push({
        dealId: deal.id,
        phase: 'NOTARY_SCHEDULED',
        avansEur: Math.round(deal.commissionEur * 0.5),
        avansPaidAt: iso(-12),
        financingStatus: 'APPROVED',
        financingBank: 'Moldindconbank',
        notaryName: 'Notar public Doina Bordea',
        notaryScheduledAt: iso(4),
        notaryActNumber: null,
        notarizedAt: null,
        cadastreRegNumber: null,
        cadastreRegisteredAt: null,
        npsScore: null,
        npsComment: null,
        npsSubmittedAt: null,
        updatedAt: iso(-1),
      });
    } else if (deal.stage === 'won') {
      out.push({
        dealId: deal.id,
        phase: 'CADASTRE_REGISTERED',
        avansEur: Math.round(deal.commissionEur * 0.5),
        avansPaidAt: iso(-30),
        financingStatus: 'APPROVED',
        financingBank: 'Maib',
        notaryName: 'Notar public Veronica Roșca',
        notaryScheduledAt: iso(-14),
        notaryActNumber: 'NA-2026-04217',
        notarizedAt: iso(-14),
        cadastreRegNumber: 'CR-9384-2026',
        cadastreRegisteredAt: iso(-7),
        npsScore: deal.id.endsWith('15') ? 9 : deal.id.endsWith('16') ? 7 : null,
        npsComment: deal.id.endsWith('15')
          ? 'Profesionalism exemplar. Recomand!'
          : null,
        npsSubmittedAt: deal.id.endsWith('15') ? iso(-3) : null,
        updatedAt: iso(-5),
      });
    } else if (deal.stage === 'negotiation') {
      out.push({
        dealId: deal.id,
        phase: 'STARTED',
        avansEur: null,
        avansPaidAt: null,
        financingStatus: 'PENDING',
        financingBank: 'Victoriabank',
        notaryName: null,
        notaryScheduledAt: null,
        notaryActNumber: null,
        notarizedAt: null,
        cadastreRegNumber: null,
        cadastreRegisteredAt: null,
        npsScore: null,
        npsComment: null,
        npsSubmittedAt: null,
        updatedAt: iso(-2),
      });
    }
  }
  return out;
}
