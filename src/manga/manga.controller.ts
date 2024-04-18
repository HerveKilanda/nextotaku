import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MangaService } from './manga.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  /**
   * Crée un nouveau manga.
   * @param createMangaDto Les données du manga à créer.
   * @param req L'objet Request pour récupérer l'ID de l'utilisateur à partir du token JWT.
   * @returns Le manga créé avec succès.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('creation')
  async createManga(
    @Body() createMangaDto: CreateMangaDto,
    @Req() req: Request,
  ) {
    const userId = req.user['userId'];
    return this.mangaService.createManga(createMangaDto, userId);
  }

  /**
   * Récupère tous les mangas.
   * @returns Tous les mangas disponibles.
   */
  @Get('get')
  getAllManga() {
    return this.mangaService.getAllManga();
  }

  /**
   * Récupère un manga par son ID.
   * @param userId L'ID du manga à récupérer.
   * @returns Le manga correspondant à l'ID fourni.
   */
  @Get(':id')
  findOne(@Param('id') userId: string) {
    return this.mangaService.findOne(+userId);
  }

  /**
   * Met à jour un manga existant.
   * @param id L'ID du manga à mettre à jour.
   * @param updateMangaDto Les données mises à jour du manga.
   * @returns Le manga mis à jour avec succès.
   */
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateManga(@Param('id') id: string, @Body() updateMangaDto: UpdateMangaDto) {
    return this.mangaService.updateManga(+id, updateMangaDto);
  }

  /**
   * Supprime un manga existant.
   * @param mangaId L'ID du manga à supprimer.
   * @returns Un message indiquant si le manga a été supprimé avec succès.
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') mangaId: string) {
    return this.mangaService.remove(Number(mangaId));
  }
}
