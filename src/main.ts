import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { config } from './shared/config/docs.config';

import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // enable cors to allow frontend to consum api
  app.enableCors({
    methods: 'GET, POST, PUT, PATCH, DELETE',
  });

  // somewhere in your initialization file
  app.use(cookieParser());

  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
