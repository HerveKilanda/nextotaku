import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpruntModule } from './emprunt/emprunt.module';
import { MangaModule } from './manga/manga.module';
import { CategorieModule } from './categorie/categorie.module';
import { AuthentificationModule } from './authentification/authentification.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';




@Module({
  imports: [
    
    EmpruntModule,
    MangaModule,
    CategorieModule,
    AuthentificationModule,
    PrismaModule,
    ConfigModule.forRoot({isGlobal: true}),
    MailerModule,
    JwtModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
