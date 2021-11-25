import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('ShowApp')
  .setDescription('ShowApp Documentation')
  .setVersion('1.0')
  .build();

export const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};
