import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('ShowApp')
  .setDescription('The ShowApp documentation')
  .setVersion('1.0.0')
  .addTag('Ticket', 'Ticket Endpoints')
  .addTag('App Welcome', 'App welcome endpoint')
  .build();

export const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'ShwoApp API',
};
