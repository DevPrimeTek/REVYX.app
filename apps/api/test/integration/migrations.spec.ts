/**
 * Migration smoke test — applies all 0001..0015 migrations against a fresh Postgres
 * container and validates that the critical tables, triggers, and constraints are present.
 *
 * Skipped automatically when Docker is unavailable (e.g. minimal CI runners). Set
 * REVYX_SKIP_INTEGRATION=1 to skip explicitly.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { setupTestDb, teardownTestDb, type TestHarness } from './setup';

const SKIP = process.env.REVYX_SKIP_INTEGRATION === '1';

describe.skipIf(SKIP)('Migrations 0001..0015 — schema integrity', () => {
  let harness: TestHarness;

  beforeAll(async () => {
    harness = await setupTestDb();
  }, 120_000);

  afterAll(async () => {
    if (harness) await teardownTestDb(harness);
  });

  it('creates all Phase 0 + Phase A tables', async () => {
    const tables = await harness.client<{ table_name: string }[]>`
      SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
       ORDER BY table_name
    `;
    const names = tables.map((t) => t.table_name);
    for (const expected of [
      'tenants', 'users', 'refresh_tokens', 'audit_log', 'gdpr_consents', 'webhook_signatures',
      'leads', 'properties', 'deals', 'activities', 'tasks', 'offers', 'showings', 'scoring_state',
    ]) {
      expect(names).toContain(expected);
    }
  });

  it('audit_log blocks UPDATE/DELETE (BR-07 append-only)', async () => {
    await harness.client`
      INSERT INTO audit_log (actor_type, event_type) VALUES ('SYSTEM', 'TEST_EVENT')
    `;
    await expect(
      harness.client`UPDATE audit_log SET event_type = 'TAMPERED' WHERE event_type = 'TEST_EVENT'`,
    ).rejects.toThrow(/AUDIT_LOG_APPEND_ONLY/);
    await expect(
      harness.client`DELETE FROM audit_log WHERE event_type = 'TEST_EVENT'`,
    ).rejects.toThrow(/AUDIT_LOG_APPEND_ONLY/);
  });

  it('tasks trigger enforces BR-04 (max 3 ACTIVE per agent)', async () => {
    const [tenant] = await harness.client<{ id: string }[]>`
      INSERT INTO tenants (slug, name) VALUES ('br04', 'BR04') RETURNING id
    `;
    const [agent] = await harness.client<{ id: string }[]>`
      INSERT INTO users (tenant_id, email, password_hash, role, full_name)
      VALUES (${tenant.id}, 'br04@x.test', 'h', 'agent', 'A') RETURNING id
    `;
    const insertActive = (label: string) => harness.client`
      INSERT INTO tasks (tenant_id, agent_id, source_entity_type, source_entity_id, task_type, status)
      VALUES (${tenant.id}, ${agent.id}, 'lead', gen_random_uuid(), 'first_contact', 'ACTIVE')
      RETURNING id, ${label}::text as label
    `;
    await insertActive('t1');
    await insertActive('t2');
    await insertActive('t3');
    await expect(insertActive('t4')).rejects.toThrow(/BR_04_MAX_3_ACTIVE_TASKS/);
  });

  it('offers trigger validates counter chain belongs to same deal', async () => {
    const [tenant] = await harness.client<{ id: string }[]>`
      INSERT INTO tenants (slug, name) VALUES ('off-chain', 'Off Chain') RETURNING id
    `;
    const [agent] = await harness.client<{ id: string }[]>`
      INSERT INTO users (tenant_id, email, password_hash, role, full_name)
      VALUES (${tenant.id}, 'off@x.test', 'h', 'agent', 'A') RETURNING id
    `;
    const [lead] = await harness.client<{ id: string }[]>`
      INSERT INTO leads (tenant_id, source, gdpr_consent_at, gdpr_consent_channel, gdpr_consent_version, data_retention_expires_at)
      VALUES (${tenant.id}, 'manual', NOW(), 'manual', '1.0.0', NOW() + INTERVAL '3 years')
      RETURNING id
    `;
    const [property] = await harness.client<{ id: string }[]>`
      INSERT INTO properties (tenant_id, property_type, transaction_type, city, area_sqm, price_amount, listing_agent_id)
      VALUES (${tenant.id}, 'apartment', 'sale', 'Chișinău', 80, 100000, ${agent.id})
      RETURNING id
    `;
    const [dealA] = await harness.client<{ id: string }[]>`
      INSERT INTO deals (tenant_id, lead_id, property_id, agent_id)
      VALUES (${tenant.id}, ${lead.id}, ${property.id}, ${agent.id}) RETURNING id
    `;
    const [dealB] = await harness.client<{ id: string }[]>`
      INSERT INTO deals (tenant_id, lead_id, property_id, agent_id)
      VALUES (${tenant.id}, ${lead.id}, ${property.id}, ${agent.id}) RETURNING id
    `;
    const [offerA] = await harness.client<{ id: string }[]>`
      INSERT INTO offers (tenant_id, deal_id, offered_by, amount, currency, amount_eur_snapshot, fx_rate_to_eur, fx_rate_source, chain_round)
      VALUES (${tenant.id}, ${dealA.id}, 'buyer', 100000, 'EUR', 100000, 1, 'BNM', 1) RETURNING id
    `;
    // Counter on a different deal must be rejected.
    await expect(harness.client`
      INSERT INTO offers (tenant_id, deal_id, offered_by, amount, currency, amount_eur_snapshot, fx_rate_to_eur, fx_rate_source, chain_round, counter_to_offer_id)
      VALUES (${tenant.id}, ${dealB.id}, 'seller', 110000, 'EUR', 110000, 1, 'BNM', 2, ${offerA.id})
    `).rejects.toThrow(/OFFER_INVALID_COUNTER_PARENT/);
  });
});
