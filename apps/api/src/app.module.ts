import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from './config/env.schema';
import { DbModule } from './db/db.module';
import { AuditModule } from './audit/audit.module';
import { AuditInterceptor } from './audit/audit.interceptor';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './rbac/roles.guard';
import { WebhooksModule } from './webhooks/webhooks.module';
import { GdprModule } from './gdpr/gdpr.module';
import { HealthController } from './health/health.controller';
import { CorrelationIdInterceptor } from './common/correlation-id.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        { name: 'public', ttl: Number(process.env.THROTTLE_PUBLIC_TTL ?? 60_000), limit: Number(process.env.THROTTLE_PUBLIC_LIMIT ?? 20) },
        { name: 'internal', ttl: Number(process.env.THROTTLE_INTERNAL_TTL ?? 60_000), limit: Number(process.env.THROTTLE_INTERNAL_LIMIT ?? 1000) },
      ],
    }),
    DbModule,
    AuditModule,
    AuthModule,
    WebhooksModule,
    GdprModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: CorrelationIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
