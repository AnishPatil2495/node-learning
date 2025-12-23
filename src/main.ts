import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Bootstrap function
 * 
 * Sets up the NestJS application with:
 * - Global validation pipe for DTO validation
 * - CORS configuration (if needed)
 * - Global prefix for API routes (optional)
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  // Automatically validates all incoming requests using DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );

  // Enable CORS (configure as needed for your frontend)
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true, // Allow cookies
  });

  // Global API prefix (optional)
  // app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();