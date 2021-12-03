import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('ShowApp')
  .setDescription('ShowApp Documentation')
  .setVersion('1.0')
  .addBearerAuth(
    { 
      description: ` Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer', 
      scheme: 'Bearer',
      type: 'http', 
      in: 'Header'
    },
    'access-token', 
  )
  .build();

export const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    tagsSorter:'alpha',
    // apisSorter:'alpha',
    // sorter:"alpha"
  },
};
