import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDb, type DrizzleDB } from './client';

export const DB_TOKEN = Symbol('DB');

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DB_TOKEN,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): DrizzleDB => {
        const url = cfg.getOrThrow<string>('DATABASE_URL');
        const pool = cfg.get<number>('DATABASE_POOL_SIZE', 20);
        const { db } = createDb(url, pool);
        return db;
      },
    },
  ],
  exports: [DB_TOKEN],
})
export class DbModule {}
