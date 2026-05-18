import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const adapter = new FastifyAdapter({
    logger: false,
    trustProxy: true,
    bodyLimit: 1_048_576, // 1 MB
  });

  // Preserve raw body for HMAC verification on webhook endpoints.
  adapter.getInstance().addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (_req, body, done) => {
      try {
        const raw = body as Buffer;
        const parsed = raw.length === 0 ? {} : JSON.parse(raw.toString('utf8'));
        (_req as { rawBody?: Buffer }).rawBody = raw;
        done(null, parsed);
      } catch (err) {
        done(err as Error, undefined);
      }
    },
  );

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    bufferLogs: true,
  });

  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3001);
  await app.listen({ port, host: '0.0.0.0' });
  new Logger('Bootstrap').log(`REVYX API listening on :${port}`);
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
