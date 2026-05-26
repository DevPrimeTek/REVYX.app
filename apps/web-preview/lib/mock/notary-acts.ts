// M0.S8 · Seed notary acts — workspace pentru notar (rol nou în demo).

import type { NotaryAct } from './transactions-types';
import { deals } from './deals';
import { leadsById } from './leads';
import { propertiesById } from './properties';

function iso(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export function buildSeedNotaryActs(): NotaryAct[] {
  const out: NotaryAct[] = [];
  for (const deal of deals) {
    if (deal.stage !== 'closing' && deal.stage !== 'won') continue;
    const lead = leadsById.get(deal.leadId);
    const prop = propertiesById.get(deal.propertyId);
    if (!lead || !prop) continue;

    if (deal.stage === 'closing') {
      out.push({
        id: `NA-${deal.id.replace('D-', '')}`,
        dealId: deal.id,
        notaryName: 'Notar public Doina Bordea',
        scheduledAt: iso(4, 11),
        signedAt: null,
        actNumber: null,
        cadastreRegNumber: null,
        status: 'SCHEDULED',
        buyerName: lead.name,
        sellerName: 'Serghei Munteanu',
        propertyAddr: prop.addr,
        amountEur: prop.priceEur,
      });
    } else {
      out.push({
        id: `NA-${deal.id.replace('D-', '')}`,
        dealId: deal.id,
        notaryName: 'Notar public Veronica Roșca',
        scheduledAt: iso(-14, 11),
        signedAt: iso(-14, 14),
        actNumber: `NA-2026-${4000 + Number(deal.id.slice(-3))}`,
        cadastreRegNumber: `CR-${9000 + Number(deal.id.slice(-3))}-2026`,
        status: 'REGISTERED',
        buyerName: lead.name,
        sellerName: 'Familia Cernei',
        propertyAddr: prop.addr,
        amountEur: prop.priceEur,
      });
    }
  }
  return out;
}
