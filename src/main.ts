import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { config } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Products Microservice');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(config.port);
  logger.log(`Application is running on port ${config.port}`);
}
bootstrap();
