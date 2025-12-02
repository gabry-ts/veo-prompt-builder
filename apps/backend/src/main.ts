import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable CORS (permissive for nginx reverse proxy)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation with Scalar UI
  const config = new DocumentBuilder()
    .setTitle('Meo Veo API')
    .setDescription('API for Veo JSON Prompt Builder')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:43800', 'Development Server (via Nginx)')
    .addServer('http://localhost:3000', 'Development Server (Direct)')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Scalar UI (dark theme by default)
  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'purple',
      darkMode: true,
      layout: 'modern',
      showSidebar: true,
    }),
  );

  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);
  // Console.log is allowed for server startup messages
  // eslint-disable-next-line no-console
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}

void bootstrap();
