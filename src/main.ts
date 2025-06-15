import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Гарантируем, что папка static существует при старте приложения
const staticPath = path.resolve(__dirname, 'static');
if (!fs.existsSync(staticPath)) {
  fs.mkdirSync(staticPath, { recursive: true });
}
// Гарантируем, что index.html существует в static
const indexPath = path.join(staticPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(
    indexPath,
    `<!DOCTYPE html>\n<html>\n<head>\n  <title>Static Index</title>\n</head>\n<body>\n  <h1>It works!</h1>\n</body>\n</html>\n`,
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('JWT-authorization')
    .setDescription('JWT-authorization API description')
    .setVersion('1.0')
    .addTag('JWT-authorization')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          return `${error.property} - ${Object.values(error.constraints || {}).join(', ')}`;
        });
        return new BadRequestException(messages);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
