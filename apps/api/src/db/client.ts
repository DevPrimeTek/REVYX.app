import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export type DrizzleDB = PostgresJsDatabase<typeof schema>;

export function createDb(url: string, poolSize = 20): { db: DrizzleDB; client: postgres.Sql } {
  const client = postgres(url, { max: poolSize, prepare: false });
  const db = drizzle(client, { schema });
  return { db, client };
}
