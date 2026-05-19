import { describe, expect, it } from 'vitest';
import {
  T01_lead_new_initial,
  T02_nba_inactive_100_days,
  T03_dhi_tf_zero,
  T04_ps_listing_90_days,
  T05_aps_new_agent,
  T06_nba_max,
  T07_offer_chain,
  apsForAgent,
  computeDhi,
  computeLeadScore,
  computeListingFreshness,
  computeNba,
  computePropertyScore,
} from './fixtures';

describe('Scoring fixtures T01..T07 (BRD §12)', () => {
  it('T01 — new lead with zero signals: formula yields 0, app must clamp to LS_initial = 0.30', () => {
    const formula = computeLeadScore(T01_lead_new_initial.inputs);
    expect(formula).toBe(0);
    // BR-02: LS_initial = 0.30 is the enforced default. The engine returns max(formula, 0.30) at INSERT.
    expect(Math.max(formula, T01_lead_new_initial.expected)).toBe(0.30);
  });

  it('T02 — NBA decays to ~0 over 100 days', () => {
    const nba = computeNba(T02_nba_inactive_100_days.inputs);
    expect(nba).toBeCloseTo(T02_nba_inactive_100_days.expected, 5);
    expect(nba).toBeLessThan(0.001);
  });

  it('T03 — DHI = 0 when TF = 0 (deal at deadline)', () => {
    const dhi = computeDhi(T03_dhi_tf_zero.inputs);
    expect(dhi).toBe(T03_dhi_tf_zero.expected);
  });

  it('T04 — LF = 0 at 90 days, PS penalized by exactly the LF weight (0.10)', () => {
    const lf = computeListingFreshness(T04_ps_listing_90_days.inputs.dayes);
    expect(lf).toBe(T04_ps_listing_90_days.expected.lf);
    const baselineFresh = computePropertyScore({ ...T04_ps_listing_90_days.inputs.otherFactors, listingFreshness: 1 });
    const stale = computePropertyScore({ ...T04_ps_listing_90_days.inputs.otherFactors, listingFreshness: lf });
    expect(stale).toBeCloseTo(T04_ps_listing_90_days.expected.psPenalized, 6);
    expect(baselineFresh - stale).toBeCloseTo(0.10, 6);
  });

  it('T05 — APS_default = 0.65 for new agent (BR-11 gate: <5 deals OR <30 days)', () => {
    expect(apsForAgent(T05_aps_new_agent.inputs)).toBe(T05_aps_new_agent.expected);
    expect(apsForAgent({ dealsCount: 4, daysSinceJoined: 365 })).toBe(0.65);
    expect(apsForAgent({ dealsCount: 100, daysSinceJoined: 20 })).toBe(0.65);
    // Agent that passes both gates uses the computed APS.
    expect(apsForAgent({ dealsCount: 50, daysSinceJoined: 365 }, 0.82)).toBe(0.82);
  });

  it('T06 — NBA = 2.0 at DP=1.0, UF=2.0 (critical), Δt=0', () => {
    expect(computeNba(T06_nba_max.inputs)).toBe(T06_nba_max.expected);
  });

  it('T07 — OFFER chain structure: 4 rounds, A is first, D is last, counter linkage intact', () => {
    const chain = T07_offer_chain.inputs;
    expect(chain).toHaveLength(T07_offer_chain.expected.rounds);
    expect(chain[0].label).toBe(T07_offer_chain.expected.firstOffer);
    expect(chain[chain.length - 1].label).toBe(T07_offer_chain.expected.lastOffer);
    // Every non-first step counters the previous one.
    for (let i = 1; i < chain.length; i++) {
      expect(chain[i].counterToLabel).toBe(chain[i - 1].label);
      expect(chain[i].chainRound).toBe(i + 1);
    }
    expect(chain[0].counterToLabel).toBeNull();
  });
});

describe('Scoring formulas — invariants', () => {
  it('NBA stays in [0, 2.0]', () => {
    const samples = [
      { dealProbability: 0, urgencyLabel: 'normal' as const, deltaTDays: 0 },
      { dealProbability: 1, urgencyLabel: 'critical' as const, deltaTDays: 0 },
      { dealProbability: 0.5, urgencyLabel: 'declared' as const, deltaTDays: 10 },
      { dealProbability: 1, urgencyLabel: 'critical' as const, deltaTDays: 9999 },
    ];
    for (const s of samples) {
      const v = computeNba(s);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(2.0);
    }
  });

  it('All [0,1] scores stay in [0,1] when components stay in [0,1]', () => {
    for (let i = 0; i <= 10; i++) {
      const x = i / 10;
      const ls = computeLeadScore({ intent: x, budgetFit: x, timelineUrgency: x, engagement: x, trustScore: x });
      const ps = computePropertyScore({ priceFit: x, locationDemand: x, propertyQuality: x, marketVelocity: x, listingFreshness: x });
      const dhi = computeDhi({ dealProbability: x, riskFactor: x, timeFactor: x });
      for (const v of [ls, ps, dhi]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it('LF transitions: 0d → 1.0, 45d → 0.5, 90d → 0.0, 200d → 0.0', () => {
    expect(computeListingFreshness(0)).toBe(1);
    expect(computeListingFreshness(45)).toBeCloseTo(0.5, 6);
    expect(computeListingFreshness(90)).toBe(0);
    expect(computeListingFreshness(200)).toBe(0);
  });
});
