import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import session from 'express-session'; // Importation par défaut d'express-session
import * as MySQLStoreFactory from 'express-mysql-session';
import { localsData } from './middlewares/localData';
const session = require('express-session');
import * as cookieParser from 'cookie-parser'

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
    database: 'nextotaku',
  };

  // Initialisation de MySQLStore avec la fonction session
  // const MySQLStore = MySQLStoreFactory(session);
  // const store = new MySQLStore(options);
  const MySQLStore = require('express-mysql-session')(session);
  const sessionStore = new MySQLStore(options);

  app.use(localsData);
  // Configuration des sessions avec express-session et MySQLStore
  app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  }));

  sessionStore.onReady().then(() => {
    // MySQL session store ready for use.
    console.log('MySQLStore ready');
  }).catch(error => {
    // Something went wrong.
    console.error(error);
  });
  app.use(cookieParser());
  await app.listen(8000);
}

bootstrap();

