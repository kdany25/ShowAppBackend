import { ValidationPipe } from '@nestjs/common';
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { config, customOptions } from './shared/config/docs.config';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);
  // enable cors to allow frontend to consum api
  app.enableCors({
    methods: 'GET, POST, PUT, PATCH, DELETE',
  });

  app.use(helmet());

  // somewhere in your initialization file
  app.use(cookieParser());

  

  await app.listen(3000);

}
bootstrap();
