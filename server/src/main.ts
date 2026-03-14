import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());

  // Enable CORS — allows Next.js dev server and production client
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      // Ensure error messages are arrays so the client can join them
      stopAtFirstError: false,
    }),
  );

  // Strip @Exclude() fields (password, refreshToken, etc.) from all responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5000;
  await app.listen(port);

  logger.log(`🚀 Smart Mom API running on port ${port}`);
  logger.log(`📊 Environment: ${process.env.NODE_ENV}`);
  logger.log(`🔗 Health: http://localhost:${port}/api/health`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});
