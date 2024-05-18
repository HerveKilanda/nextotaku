import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session'; // Importation par défaut d'express-session
import MySQLStoreFactory from 'express-mysql-session'; // Importation correcte de MySQLStore
import { localsData } from './middlewares/localData';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Otakulinks API')
    .setDescription('Otakulinks description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Options de configuration de la base de données MySQL
  const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'nextotaku',
  };

  // Initialisation de MySQLStore avec la fonction session
  const MySQLStore = MySQLStoreFactory(session);
  const store = new MySQLStore(options);

  app.use(localsData);
  // Configuration des sessions avec express-session et MySQLStore
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      store: store,
    }),
  );

  await app.listen(8000);
}

bootstrap();
