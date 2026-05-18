import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://revyx_app:dev_password@localhost:5432/revyx_dev',
  },
  strict: true,
  verbose: true,
} satisfies Config;
