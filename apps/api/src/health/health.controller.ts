import { Controller, Get, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { Public } from '@/auth/jwt-auth.guard';
import { DB_TOKEN } from '@/db/db.module';
import type { DrizzleDB } from '@/db/client';

@Controller('health')
export class HealthController {
  constructor(@Inject(DB_TOKEN) private readonly db: DrizzleDB) {}

  @Public()
  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Public()
  @Get('ready')
  async ready() {
    try {
      await this.db.execute(sql`SELECT 1`);
      return { status: 'ok', db: 'ok' };
    } catch (err) {
      return { status: 'degraded', db: (err as Error).message };
    }
  }
}
