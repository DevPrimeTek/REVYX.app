/**
 * Tenant isolation invariant — proves that LeadsService.list/findOne filter strictly
 * by tenant_id, even when an ID is shared across tenants by mistake. This is the
 * acceptance test the Phase A scaffold is built around.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { LeadsService } from '@/business/leads/leads.service';
import { setupTestDb, teardownTestDb, seedTenant, type TestHarness } from './setup';
import type { CreateLeadInput } from '@/business/leads/leads.dto';

const SKIP = process.env.REVYX_SKIP_INTEGRATION === '1';

const minimalLead = (): CreateLeadInput => ({
  source: 'manual',
  fullName: 'Test Lead',
  phoneE164: '+37368000000',
  gdprConsentAt: new Date(),
  gdprConsentChannel: 'manual',
  gdprConsentVersion: '1.0.0',
  dataRetentionExpiresAt: new Date(Date.now() + 3 * 365 * 24 * 3600 * 1000),
});

describe.skipIf(SKIP)('Leads — tenant isolation + T01 LS_initial', () => {
  let harness: TestHarness;
  let svc: LeadsService;
  let tenantA: string;
  let tenantB: string;

  beforeAll(async () => {
    harness = await setupTestDb();
    svc = new LeadsService(harness.db);
    ({ tenantId: tenantA } = await seedTenant(harness.client, { slug: 'iso-a' }));
    ({ tenantId: tenantB } = await seedTenant(harness.client, { slug: 'iso-b' }));
  }, 120_000);

  afterAll(async () => {
    if (harness) await teardownTestDb(harness);
  });

  it('T01 — newly created lead defaults to LS = 0.300, TS = 0.500, IS = 0.000', async () => {
    const lead = await svc.create(tenantA, minimalLead());
    expect(Number(lead.leadScore)).toBe(0.3);
    expect(Number(lead.trustScore)).toBe(0.5);
    expect(Number(lead.interactionStrength)).toBe(0);
    expect(lead.status).toBe('NEW');
    expect(lead.firewallState).toBe('PENDING');
  });

  it('list(tenantA) returns only tenant A leads, never tenant B', async () => {
    await svc.create(tenantA, minimalLead());
    await svc.create(tenantA, minimalLead());
    await svc.create(tenantB, minimalLead());

    const a = await svc.list(tenantA, { limit: 100, offset: 0 });
    const b = await svc.list(tenantB, { limit: 100, offset: 0 });
    expect(a.items.length).toBeGreaterThanOrEqual(3); // includes the T01 lead from previous it()
    expect(b.items.length).toBeGreaterThanOrEqual(1);
    for (const l of a.items) expect(l.tenantId).toBe(tenantA);
    for (const l of b.items) expect(l.tenantId).toBe(tenantB);
  });

  it('findOne(tenantA, idFromTenantB) returns 404 — no cross-tenant leak', async () => {
    const leadB = await svc.create(tenantB, minimalLead());
    await expect(svc.findOne(tenantA, leadB.id)).rejects.toThrow();
  });

  it('update enforces optimistic locking via version', async () => {
    const lead = await svc.create(tenantA, minimalLead());
    const v1 = lead.version;
    const updated = await svc.update(tenantA, lead.id, { status: 'QUALIFIED', expectedVersion: v1 });
    expect(updated.version).toBe(v1 + 1);
    expect(updated.status).toBe('QUALIFIED');
    // Stale version → conflict.
    await expect(svc.update(tenantA, lead.id, { status: 'CONTACTED', expectedVersion: v1 })).rejects.toThrow();
  });
});
