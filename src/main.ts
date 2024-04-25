import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { JwtModule } from '@nestjs/jwt';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
      .setTitle('Otakulinks API')
      .setDescription('Otakulinks description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
     app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
