/**
 * Simple sequential migration runner.
 * Applies every `XXXX_*.sql` file from `./migrations/` in lex order and tracks
 * applied ones in a `_migrations` table. Idempotent — re-running is safe.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import postgres from 'postgres';

const MIGRATIONS_DIR = join(__dirname, 'migrations');

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');

  const sql = postgres(url, { max: 1, prepare: false });

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        name        TEXT PRIMARY KEY,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    const files = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith('.sql'))
      .sort();

    const appliedRows = await sql<{ name: string }[]>`SELECT name FROM _migrations`;
    const applied = new Set(appliedRows.map((r) => r.name));

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[migrate] skip ${file} (already applied)`);
        continue;
      }
      const body = await readFile(join(MIGRATIONS_DIR, file), 'utf8');
      console.log(`[migrate] apply ${file}`);
      await sql.begin(async (tx) => {
        await tx.unsafe(body);
        await tx`INSERT INTO _migrations (name) VALUES (${file})`;
      });
    }

    console.log('[migrate] done');
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error('[migrate] failed:', err);
  process.exit(1);
});
