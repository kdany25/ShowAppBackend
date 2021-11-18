import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { config, customOptions } from './shared/config/docs.config';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  // somewhere in your initialization file
  app.use(cookieParser());

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
