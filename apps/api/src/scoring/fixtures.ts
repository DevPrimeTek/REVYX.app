/**
 * Test fixtures T01–T07 — REVYX scoring edge cases.
 * Source of truth: BRD §12 "Edge Cases Obligatorii" + §7 scoring formulas.
 *
 * Each fixture exposes (a) inputs, (b) expected output, (c) cross-ref to the
 * acceptance row. The scoring engines (M1.S3+) consume these via the assertions
 * in `fixtures.spec.ts` — failures here block merge of any engine change.
 */

export interface ScoringFixture<TInputs, TExpected> {
  id: string;
  description: string;
  brdRef: string;
  inputs: TInputs;
  expected: TExpected;
  tolerance?: number;
}

// ────────────────────────────────────────────────────────────────
// LEAD SCORE — LS = (0.35·I) + (0.25·BF) + (0.15·TU) + (0.15·E) + (0.10·TS)
// LS_initial = 0.30 (BR-02) when no signals exist yet.
// ────────────────────────────────────────────────────────────────

export interface LeadScoreInputs {
  intent: number;
  budgetFit: number;
  timelineUrgency: number;
  engagement: number;
  trustScore: number;
}

export function computeLeadScore(i: LeadScoreInputs): number {
  const ls = 0.35 * i.intent + 0.25 * i.budgetFit + 0.15 * i.timelineUrgency + 0.15 * i.engagement + 0.10 * i.trustScore;
  return Math.max(0, Math.min(1, ls));
}

// ────────────────────────────────────────────────────────────────
// PROPERTY SCORE — PS = (0.40·PF) + (0.20·LD) + (0.15·PQ) + (0.15·MV) + (0.10·LF)
// LF = 1 − min(1, days/90)
// ────────────────────────────────────────────────────────────────

export interface PropertyScoreInputs {
  priceFit: number;
  locationDemand: number;
  propertyQuality: number;
  marketVelocity: number;
  listingFreshness: number;
}

export function computeListingFreshness(daysSinceListed: number): number {
  return Math.max(0, 1 - Math.min(1, daysSinceListed / 90));
}

export function computePropertyScore(i: PropertyScoreInputs): number {
  const ps = 0.40 * i.priceFit + 0.20 * i.locationDemand + 0.15 * i.propertyQuality + 0.15 * i.marketVelocity + 0.10 * i.listingFreshness;
  return Math.max(0, Math.min(1, ps));
}

// ────────────────────────────────────────────────────────────────
// DEAL PROBABILITY — DP = (0.30·LS) + (0.30·PS) + (0.20·APS) + (0.20·IS)
// APS_default = 0.65 for agents with <5 deals OR <30 days (BR-11)
// ────────────────────────────────────────────────────────────────

export interface DealProbabilityInputs {
  leadScore: number;
  propertyScore: number;
  agentPerformanceScore: number;
  interactionStrength: number;
}

export function computeDealProbability(i: DealProbabilityInputs): number {
  const dp = 0.30 * i.leadScore + 0.30 * i.propertyScore + 0.20 * i.agentPerformanceScore + 0.20 * i.interactionStrength;
  return Math.max(0, Math.min(1, dp));
}

// ────────────────────────────────────────────────────────────────
// NEXT BEST ACTION — NBA = DP × UF × e^(−0.1·Δt)  ∈ [0, 2.0]
// UF: 1.0 normal · 1.3 approaching · 1.6 declared · 2.0 critical
// ────────────────────────────────────────────────────────────────

export type UrgencyLabel = 'normal' | 'approaching' | 'declared' | 'critical';

export function urgencyFactor(label: UrgencyLabel): number {
  switch (label) {
    case 'normal': return 1.0;
    case 'approaching': return 1.3;
    case 'declared': return 1.6;
    case 'critical': return 2.0;
  }
}

export interface NbaInputs {
  dealProbability: number;
  urgencyLabel: UrgencyLabel;
  deltaTDays: number;
}

export function computeNba(i: NbaInputs): number {
  const uf = urgencyFactor(i.urgencyLabel);
  const decay = Math.exp(-0.1 * Math.max(0, i.deltaTDays));
  const nba = i.dealProbability * uf * decay;
  return Math.max(0, Math.min(2.0, nba));
}

// ────────────────────────────────────────────────────────────────
// DEAL HEALTH INDEX — DHI = DP × (1 − RF) × TF
// TF_default = 0.70 when expected_close_date is NULL (BR-10)
// ────────────────────────────────────────────────────────────────

export interface DhiInputs {
  dealProbability: number;
  riskFactor: number;
  timeFactor: number;
}

export function computeDhi(i: DhiInputs): number {
  const dhi = i.dealProbability * (1 - i.riskFactor) * i.timeFactor;
  return Math.max(0, Math.min(1, dhi));
}

// ────────────────────────────────────────────────────────────────
// Fixtures T01..T07 (BRD §12)
// ────────────────────────────────────────────────────────────────

export const T01_lead_new_initial: ScoringFixture<LeadScoreInputs, number> = {
  id: 'T01',
  description: 'LS with all factors = 0 (brand new lead) → LS_initial = 0.30',
  brdRef: 'BRD §12 + §7.1 + BR-02',
  inputs: { intent: 0, budgetFit: 0, timelineUrgency: 0, engagement: 0, trustScore: 0 },
  // The formula yields 0; LS_initial = 0.30 is enforced at INSERT level (DB default),
  // not by the formula. Engines must clamp UP to 0.30 when no positive signal exists.
  expected: 0.30,
};

export const T02_nba_inactive_100_days: ScoringFixture<NbaInputs, number> = {
  id: 'T02',
  description: 'NBA with Δt = 100 days (inactive deal) → NBA ≈ 0 (e^−10 ≈ 0.0000454)',
  brdRef: 'BRD §12 + §7.5',
  inputs: { dealProbability: 1.0, urgencyLabel: 'normal', deltaTDays: 100 },
  // Math.exp(-10) ≈ 0.00004539992976248485
  expected: 0.0000454,
  tolerance: 1e-5,
};

export const T03_dhi_tf_zero: ScoringFixture<DhiInputs, number> = {
  id: 'T03',
  description: 'DHI with TF = 0 (deal at deadline) → DHI = 0 → critical alert',
  brdRef: 'BRD §12 + §7.8',
  inputs: { dealProbability: 0.8, riskFactor: 0.2, timeFactor: 0 },
  expected: 0,
};

export const T04_ps_listing_90_days: ScoringFixture<
  { dayes: number; otherFactors: Omit<PropertyScoreInputs, 'listingFreshness'> },
  { lf: number; psPenalized: number }
> = {
  id: 'T04',
  description: 'PS with LF at 90+ days listing → LF = 0.0 → PS penalized by ≈10% (LF weight)',
  brdRef: 'BRD §12 + §7.2',
  inputs: {
    dayes: 90,
    otherFactors: { priceFit: 0.8, locationDemand: 0.7, propertyQuality: 0.6, marketVelocity: 0.5 },
  },
  // LF=0 contributes 0 to PS; baseline (LF=1) would contribute 0.10. PS_penalized = baseline − 0.10.
  expected: { lf: 0, psPenalized: 0.40 * 0.8 + 0.20 * 0.7 + 0.15 * 0.6 + 0.15 * 0.5 + 0.10 * 0 },
};

export const T05_aps_new_agent: ScoringFixture<{ dealsCount: number; daysSinceJoined: number }, number> = {
  id: 'T05',
  description: 'APS for new agent (0 deals) → APS_default = 0.65 → DP not artificially penalized',
  brdRef: 'BRD §12 + §7.7 + BR-11',
  inputs: { dealsCount: 0, daysSinceJoined: 5 },
  expected: 0.65,
};

export function apsForAgent(stats: { dealsCount: number; daysSinceJoined: number }, computed?: number): number {
  if (stats.dealsCount < 5 || stats.daysSinceJoined < 30) return 0.65;
  return computed ?? 0.65;
}

export const T06_nba_max: ScoringFixture<NbaInputs, number> = {
  id: 'T06',
  description: 'NBA with DP=1.0, UF=2.0 (critical), Δt=0 → NBA = 2.0 (max)',
  brdRef: 'BRD §12 + §7.5',
  inputs: { dealProbability: 1.0, urgencyLabel: 'critical', deltaTDays: 0 },
  expected: 2.0,
};

/**
 * T07 — OFFER chain A → B → C → D with counter_to_offer_id linkage.
 * Verified via integration test (testcontainers-postgres) that the
 * trigger `offer_validate_counter_parent` rejects cross-deal counters,
 * and that querying ORDER BY chain_round returns the full chain.
 */
export interface OfferChainStep {
  label: 'A' | 'B' | 'C' | 'D';
  chainRound: number;
  counterToLabel: 'A' | 'B' | 'C' | 'D' | null;
  offeredBy: 'buyer' | 'agent_on_behalf_buyer' | 'seller' | 'agent_on_behalf_seller';
  amountEur: number;
}

export const T07_offer_chain: ScoringFixture<OfferChainStep[], { rounds: number; firstOffer: 'A'; lastOffer: 'D' }> = {
  id: 'T07',
  description: 'OFFER chain A → B → C → D · counter_to_offer_id correct per row',
  brdRef: 'BRD §12 + TECH_SPEC_REVYX_offer-engine_v1.0.0.md §4.1',
  inputs: [
    { label: 'A', chainRound: 1, counterToLabel: null, offeredBy: 'buyer', amountEur: 100_000 },
    { label: 'B', chainRound: 2, counterToLabel: 'A',  offeredBy: 'seller', amountEur: 115_000 },
    { label: 'C', chainRound: 3, counterToLabel: 'B',  offeredBy: 'buyer', amountEur: 105_000 },
    { label: 'D', chainRound: 4, counterToLabel: 'C',  offeredBy: 'seller', amountEur: 110_000 },
  ],
  expected: { rounds: 4, firstOffer: 'A', lastOffer: 'D' },
};

export const ALL_FIXTURES = [
  T01_lead_new_initial,
  T02_nba_inactive_100_days,
  T03_dhi_tf_zero,
  T04_ps_listing_90_days,
  T05_aps_new_agent,
  T06_nba_max,
  T07_offer_chain,
] as const;
