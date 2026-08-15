import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  const origins = String(process.env.CORS_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean);
  app.enableCors({
    origin: origins.length ? origins : true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix('api');

  const http = app.getHttpAdapter().getInstance();
  http.get('/', (_req: unknown, res: any) => res.json({
    status: 'ok',
    service: 'khadakx-api',
    message: 'KhadakX API is running',
    health: '/health',
    ready: '/ready',
  }));
  http.get('/health', (_req: unknown, res: any) => res.json({ status: 'ok', service: 'khadakx-api' }));
  http.get('/ready', (_req: unknown, res: any) => res.json({ status: 'ready', service: 'khadakx-api' }));

  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
  console.log(`KhadakX API running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('KhadakX API startup failed', error);
  process.exit(1);
});
