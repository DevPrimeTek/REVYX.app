import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { GdprController } from './gdpr.controller';
import { GdprService } from './gdpr.service';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [GdprController],
  providers: [GdprService],
})
export class GdprModule {}
