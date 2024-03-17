import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Postcom')
    .setDescription('API for writing posts')
    .setVersion('1.0')
    .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Введите JWT токен',
          in: 'header',
        },
        'token'
      )
    .addTag('Endpoints')
    .build();