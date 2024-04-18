import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { AuthentificationModule } from 'src/authentification/authentification.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports : [AuthentificationModule],
  controllers: [MangaController],
  providers: [MangaService,PrismaService],
})
export class MangaModule {}
