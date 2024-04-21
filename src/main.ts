import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import SwaggerSetup from '@shared/swagger/swagger.setup';
import Logger from '@shared/loggers/winston.logger';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const PORT = process.env.port || 4500;

// TODO Logger ( Cloud )
// TODO Deploy ( Docker)
// TODO CRUD Service ( MongoDB )
// TODO CURD Service ( Prisma )
// TODO CRUD Service ( MySQL )
// TODO CRUD Controller
// TODO SMS Sender
// TODO Slack Sender
// TODO File Storage

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // * Setup Swagger
  SwaggerSetup(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(PORT);
  Logger.info(`Server Listen on PORT: ${PORT}`, {
    contextName: 'Main',
    methodName: bootstrap.name,
  });
}

bootstrap();
