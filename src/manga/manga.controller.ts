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
  NotFoundException,
} from '@nestjs/common';
import { MangaService } from './manga.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/authentification/guards';
import { Roles } from 'src/authentification/role.decorateur';
import { Manga, Role } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('manga')
@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  // /**
  //  * Crée un nouveau manga.
  //  * @param createMangaDto Les données du manga à créer.
  //  * @param req L'objet Request pour récupérer l'ID de l'utilisateur à partir du token JWT.
  //  * @returns Le manga créé avec succès.
  //  */
  // @Roles(Role.ADMIN) // Décorateur pour spécifier les rôles autorisés
  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  // @Post('creation')
  // async createManga(
  //   @Body() createMangaDto: CreateMangaDto,
  //   @Req() req: Request,
  // ) {
  //   const userId = req.user['userId'];
  //   return this.mangaService.createManga(createMangaDto, userId);
  // }

  /**
   * Récupère tous les mangas.
   * @returns Tous les mangas disponibles.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('get')
  getAllManga() {
    return this.mangaService.getAllManga();
  }

  /**
   * Met à jour un manga existant.
   * @param id L'ID du manga à mettre à jour.
   * @param updateMangaDto Les données mises à jour du manga.
   * @returns Le manga mis à jour avec succès.
   */
  @Roles(Role.ADMIN) // Décorateur pour spécifier les rôles autorisés
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Patch(':id')
  updateManga(@Param('id') id: string, @Body() updateMangaDto: UpdateMangaDto) {
    return this.mangaService.updateManga(+id, updateMangaDto);
  }

  /**
   * Supprime un manga existant.
   * @param mangaId L'ID du manga à supprimer.
   * @returns Un message indiquant si le manga a été supprimé avec succès.
   */
  @Roles(Role.ADMIN) // Décorateur pour spécifier les rôles autorisés
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  remove(@Param('id') mangaId: string) {
    return this.mangaService.remove(Number(mangaId));
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get('fetch-and-store')
  async fetchAndStoreMangas(@Req() req: Request): Promise<Manga[]> {
    const userId = req.user['userId'];
    if (!userId) {
      throw new NotFoundException("L'utilisateur de n'a pas été trouvé");
    }
    return this.mangaService.fetchAndStoreMangas();
  }

  // Méthode pour récupérer les détails d'un manga par ID
  @Get('details/:id')
  async fetchMangaDetails(@Param('id') mangaId: string): Promise<any> {
    const manga = await this.mangaService.fetchMangaDetails(Number(mangaId));
    if (!manga) {
      throw new NotFoundException(`Manga avec l'ID ${mangaId} non trouvé`);
    }
    return manga;
  }

   /**
   * Récupère les détails d'un manga par son ID.
   * @param mangaId L'ID du manga à récupérer.
   * @returns Le manga correspondant à l'ID fourni.
   */
   @Get(':id')
   async fetchMangaById(@Param('id') mangaId: string): Promise<any> {
     const manga = await this.mangaService.fetchMangaById(Number(mangaId));
     if (!manga) {
       throw new NotFoundException(`Manga avec l'ID ${mangaId} non trouvé`);
     }
     return manga;
   }

}
