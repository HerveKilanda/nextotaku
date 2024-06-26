import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { AuthentificationModule } from 'src/authentification/authentification.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports : [AuthentificationModule,HttpModule],
  controllers: [MangaController],
  providers: [MangaService,PrismaService],
})
export class MangaModule {}
