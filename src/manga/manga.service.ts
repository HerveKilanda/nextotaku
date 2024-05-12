import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { Manga } from './entities/manga.entity';

@Injectable()
export class MangaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouveau manga.
   * @param createMangaDto Les données du manga à créer.
   * @param userId L'ID de l'utilisateur créant le manga.
   * @returns Un message indiquant que le manga a été créé avec succès.
   */
  async createManga(createMangaDto: CreateMangaDto, userId: any) {
    const { titre, description, categorieId } = createMangaDto;
    await this.prisma.manga.create({
      data: { titre, description, categorieId, userId },
    });
    return { data: 'Manga créé' };
  }

  /**
   * Récupère tous les mangas.
   * @returns Tous les mangas disponibles.
   */
  async getAllManga(): Promise<Manga[]> {
    try {
      return await this.prisma.manga.findMany({
        where: { status: Status.LIBRE },
      });
    } catch (error) {
      throw new HttpException(
        'Echec de la récuperation des mangas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Récupère un manga par son ID.
   * @param mangaId L'ID du manga à récupérer.
   * @returns Le manga correspondant à l'ID fourni ou lance une exception si le manga n'est pas trouvé.
   * @throws NotFoundException si le manga n'est pas trouvé.
   * @throws BadRequestException si l'ID du manga n'est pas valide.
   */
  async MangafindOne(mangaId: number): Promise<Manga> {
    if (!Number.isInteger(mangaId) || mangaId <= 0) {
      throw new BadRequestException('Invalid mangaId');
    }
    const manga = await this.prisma.manga.findUnique({ where: { mangaId } });
    if (!manga) {
      throw new NotFoundException(`Manga with ID ${mangaId} not found`);
    }
    return manga;
  }

  /**
   * Met à jour un manga existant.
   * @param id L'ID du manga à mettre à jour.
   * @param updateMangaDto Les données mises à jour du manga.
   * @returns Le manga mis à jour avec succès.
   */
  async updateManga(
    id: number,
    updateMangaDto: UpdateMangaDto,
  ): Promise<Manga> {
    const manga = await this.prisma.manga.update({
      where: { mangaId: id },
      data: updateMangaDto,
    });

    if (!manga) {
      throw new NotFoundException(`Manga with ID ${id} not found`);
    }
    return manga;
  }

  /**
   * Supprime un manga existant.
   * @param mangaId L'ID du manga à supprimer.
   * @returns Un message indiquant si le manga a été supprimé avec succès.
   */
  async remove(mangaId: number): Promise<{ message: string }> {
    const manga = await this.prisma.manga.findUnique({
      where: { mangaId },
    });

    if (!manga) {
      throw new HttpException('Manga non trouvé', HttpStatus.NOT_FOUND);
    }

    if (manga.status === 'EMPRUNTE') {
      throw new HttpException(
        'Le manga est actuellement emprunté et ne peut être supprimé',
        HttpStatus.CONFLICT,
      );
    }

    await this.prisma.manga.delete({
      where: { mangaId },
    });

    return { message: 'Le manga a été supprimé avec succès' };
  }
}
