/**
 * Shared integration test harness.
 *
 * Spins up a real PostgreSQL via Testcontainers, runs the same SQL migrations the
 * production runner applies (apps/api/src/db/migrations/*), then exposes a Drizzle
 * client + helper for seeding a tenant + user. Tests should call `setupTestDb()` in
 * `beforeAll` and `teardownTestDb()` in `afterAll`.
 *
 * Requires a working Docker daemon. Skipped via `it.skipIf(!process.env.TESTCONTAINERS_OK)`
 * when run in environments without Docker.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import * as schema from '@/db/schema';

const MIGRATIONS_DIR = join(__dirname, '..', '..', 'src', 'db', 'migrations');

export type TestDb = PostgresJsDatabase<typeof schema>;

export interface TestHarness {
  container: StartedPostgreSqlContainer;
  client: postgres.Sql;
  db: TestDb;
}

export async function setupTestDb(): Promise<TestHarness> {
  const container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('revyx_test')
    .withUsername('revyx_test')
    .withPassword('test')
    .start();

  const url = container.getConnectionUri();
  const client = postgres(url, { max: 5, prepare: false });

  // Apply migrations in lex order, same logic as src/db/migrate.ts.
  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    const body = await readFile(join(MIGRATIONS_DIR, file), 'utf8');
    await client.unsafe(body);
  }

  const db = drizzle(client, { schema });
  return { container, client, db };
}

export async function teardownTestDb(h: TestHarness): Promise<void> {
  await h.client.end({ timeout: 5 });
  await h.container.stop();
}

/**
 * Seed a tenant + agent user. Returns IDs for use in test factories.
 */
export async function seedTenant(
  client: postgres.Sql,
  opts: { slug?: string; agentEmail?: string } = {},
): Promise<{ tenantId: string; agentId: string }> {
  const slug = opts.slug ?? `t-${Math.random().toString(36).slice(2, 8)}`;
  const email = opts.agentEmail ?? `${slug}-agent@example.test`;

  const [tenant] = await client<{ id: string }[]>`
    INSERT INTO tenants (slug, name) VALUES (${slug}, ${'Test ' + slug}) RETURNING id
  `;
  const [agent] = await client<{ id: string }[]>`
    INSERT INTO users (tenant_id, email, password_hash, role, full_name)
    VALUES (${tenant.id}, ${email}, ${'$argon2id$placeholder'}, 'agent', 'Test Agent')
    RETURNING id
  `;
  return { tenantId: tenant.id, agentId: agent.id };
}
