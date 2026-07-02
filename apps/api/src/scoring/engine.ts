/**
 * Scoring engine — production-side pure functions for the BRD §7 formulas.
 * Split out of fixtures.ts (P0-3, ARCH_REVIEW F-ARCH-03): fixtures describe the
 * expected values (BRD §12 T01..T07); this module is the single implementation
 * the M1.S3+ engines build on. Any change here must keep fixtures.spec.ts green.
 */

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

export function apsForAgent(stats: { dealsCount: number; daysSinceJoined: number }, computed?: number): number {
  if (stats.dealsCount < 5 || stats.daysSinceJoined < 30) return 0.65;
  return computed ?? 0.65;
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
