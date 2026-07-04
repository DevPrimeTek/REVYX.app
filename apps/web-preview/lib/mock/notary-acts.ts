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

// Poo­luri de vânzători + ore programare → acte distincte chiar dacă două deal-uri
// nimeresc aceeași proprietate (coincidență RNG în seed-ul deals). Fix audit UX.
const SELLER_POOL = ['Serghei Munteanu', 'Familia Cernei', 'Andrei Rusu', 'Maria Ceban', 'Ion Postolachi'];

export function buildSeedNotaryActs(): NotaryAct[] {
  const out: NotaryAct[] = [];
  for (const deal of deals) {
    if (deal.stage !== 'closing' && deal.stage !== 'won') continue;
    const lead = leadsById.get(deal.leadId);
    const prop = propertiesById.get(deal.propertyId);
    if (!lead || !prop) continue;
    // Regula 20: notary acts apar doar pe sale flow (buyer/seller). Rental deals folosesc
    // lease agreement (vezi lib/mock/lease-agreements.ts) — workflow simplificat fără notar.
    if (lead.leadType === 'tenant' || lead.leadType === 'landlord') continue;

    const n = Number(deal.id.slice(-3));
    const seller = SELLER_POOL[n % SELLER_POOL.length];
    if (deal.stage === 'closing') {
      out.push({
        id: `NA-${deal.id.replace('D-', '')}`,
        dealId: deal.id,
        notaryName: 'Notar public Doina Bordea',
        scheduledAt: iso(2 + (n % 6), 9 + (n % 7)),
        signedAt: null,
        actNumber: null,
        cadastreRegNumber: null,
        status: 'SCHEDULED',
        buyerName: lead.name,
        sellerName: seller,
        propertyAddr: prop.addr,
        amountEur: prop.priceEur,
      });
    } else {
      out.push({
        id: `NA-${deal.id.replace('D-', '')}`,
        dealId: deal.id,
        notaryName: 'Notar public Veronica Roșca',
        scheduledAt: iso(-30 + (n % 20), 9 + (n % 7)),
        signedAt: iso(-28 + (n % 18), 14),
        actNumber: `NA-2026-${4000 + n}`,
        cadastreRegNumber: `CR-${9000 + n}-2026`,
        status: 'REGISTERED',
        buyerName: lead.name,
        sellerName: seller,
        propertyAddr: prop.addr,
        amountEur: prop.priceEur,
      });
    }
  }
  return out;
}
