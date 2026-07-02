/**
 * Test fixtures T01–T07 — REVYX scoring edge cases.
 * Source of truth: BRD §12 "Edge Cases Obligatorii" + §7 scoring formulas.
 *
 * Each fixture exposes (a) inputs, (b) expected output, (c) cross-ref to the
 * acceptance row. The production implementation lives in ./engine.ts (P0-3,
 * ARCH_REVIEW F-ARCH-03) — this file holds ONLY the expectation tables;
 * fixtures.spec.ts asserts the engine against them and blocks merge on drift.
 */

import type { DhiInputs, LeadScoreInputs, NbaInputs, PropertyScoreInputs } from './engine';

export interface ScoringFixture<TInputs, TExpected> {
  id: string;
  description: string;
  brdRef: string;
  inputs: TInputs;
  expected: TExpected;
  tolerance?: number;
}

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
