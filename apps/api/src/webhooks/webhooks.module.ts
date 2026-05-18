import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhooksController } from './webhooks.controller';
import { WebhookHmacGuard } from './webhook-hmac.guard';

@Module({
  imports: [ConfigModule],
  controllers: [WebhooksController],
  providers: [WebhookHmacGuard],
})
export class WebhooksModule {}
