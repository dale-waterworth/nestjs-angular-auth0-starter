import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Try to load .env file, fallback to env.txt if .env doesn't exist
if (fs.existsSync('.env')) {
  dotenv.config();
} else if (fs.existsSync('env.txt')) {
  dotenv.config({ path: 'env.txt' });
} else {
  console.warn('No environment file found (.env or env.txt)');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use Pino logger
  app.useLogger(app.get(Logger));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();