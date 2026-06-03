// M0.S3 · T-M0.S3-05 · 20 mock deals with realistic DP/DHI across 6 stages · 🌐 Web only
// Master Plan ref: docs/MASTER_PLAN_REVYX_execution-roadmap_v1.1.2.md §4.1 (M0.S3)
// BR-10 TF_default = 0.70 when expected_close_date is NULL.

import { makeRng } from './rng';
import type { Deal, DealStage } from './types';
import { leads } from './leads';
import { properties } from './properties';

const stageOrder: DealStage[] = ['discovery', 'qualified', 'offer', 'negotiation', 'closing', 'won'];

// Target distribution across 20 deals.
const stageDistribution: DealStage[] = [
  'discovery', 'discovery', 'discovery',
  'qualified', 'qualified', 'qualified', 'qualified',
  'offer', 'offer', 'offer',
  'negotiation', 'negotiation', 'negotiation',
  'closing', 'closing',
  'won', 'won', 'won', 'won', 'won',
];

function buildDeals(): Deal[] {
  const rng = makeRng('revyx.deals.v1');
  // Only consider qualified/HOT leads as candidates for deals (Lead Firewall).
  // Deals există pe ambele profiles (sale + rent); commission differs per profile.
  const candidateLeads = leads.filter((l) => l.status === 'HOT' || l.status === 'qualified');
  const out: Deal[] = [];

  for (let i = 0; i < 20; i++) {
    const stage = stageDistribution[i];
    const stageIdx = stageOrder.indexOf(stage);

    // DP grows with stage (rough monotonic curve), DHI stays in healthy band.
    const dpBase = 0.20 + stageIdx * 0.12;
    const dp = stage === 'won' ? 1.0 :
      Math.round(Math.min(0.95, Math.max(0.15, dpBase + rng.range(-0.08, 0.12))) * 100) / 100;
    const dhi = stage === 'won' ? Math.round(rng.range(0.85, 0.96) * 100) / 100 :
      Math.round(Math.max(0.45, Math.min(0.92, 0.6 + stageIdx * 0.04 + rng.range(-0.15, 0.18))) * 100) / 100;

    const lead = candidateLeads[i % candidateLeads.length];

    // Regula 20: Match property la intent-ul lead-ului.
    // sale (buyer/seller) ↔ priceEur>0 (sale|both)
    // rent (tenant/landlord) ↔ monthlyRentEur>0 (rent|both)
    const isRent = lead.leadType === 'tenant' || lead.leadType === 'landlord';
    const compatibleProps = properties.filter((p) =>
      isRent
        ? (p.listingType === 'rent' || p.listingType === 'both')
        : (p.listingType === 'sale' || p.listingType === 'both'),
    );
    const property = compatibleProps[rng.int(0, compatibleProps.length - 1)] ?? properties[0];

    // Expected close date: NULL for early stages (TF_default 0.70 applies per BR-10).
    // Rent profile: ciclu ~21 zile (vs 90 zile sale).
    const closeDateRange = isRent ? [3, 25] : [7, 90];
    const expectedCloseDate = stageIdx < 2 ? null :
      (() => {
        const d = new Date('2026-05-17');
        d.setDate(d.getDate() + rng.int(closeDateRange[0], closeDateRange[1]));
        return d.toISOString().slice(0, 10);
      })();

    // Commission profile (Regula 20):
    //   sale: property.commissionPct% din priceEur (negociat la create; default 2.5%)
    //   rent: property.commissionPct% din monthlyRentEur (negociat la create; default 100% = 1× chirie)
    const pct = (property.commissionPct ?? (isRent ? 100 : 2.5)) / 100;
    const baseAmount = isRent ? (property.monthlyRentEur ?? 0) : property.priceEur;
    const commissionEur = Math.round((baseAmount * pct) / 10) * 10;

    out.push({
      id: `D-${String(1000 + i).padStart(4, '0')}`,
      leadId: lead.id,
      propertyId: property.id,
      agentId: lead.agentId ?? property.agentId,
      stage,
      dp,
      dhi,
      expectedCloseDate,
      commissionEur,
      needsReview: rng.next() < 0.10,
    });
  }
  return out;
}

export const deals: readonly Deal[] = buildDeals();
export const dealsById = new Map(deals.map((d) => [d.id, d]));
export { stageOrder };
