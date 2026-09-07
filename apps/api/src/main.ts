import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

let server: ReturnType<Awaited<ReturnType<typeof createApp>>['getHttpAdapter']['getInstance']>;

async function createApp() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  await app.init();
  return app;
}

async function getServer() {
  if (!server) {
    const app = await createApp();
    server = app.getHttpAdapter().getInstance();
  }

  return server;
}

export default async function handler(req: unknown, res: unknown) {
  const appServer = await getServer();
  return appServer(req, res);
}

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
  console.log(`QueryQuest API running on: http://localhost:${port}/api/v1`);
}

if (process.env.VERCEL !== '1') {
  bootstrap();
}
