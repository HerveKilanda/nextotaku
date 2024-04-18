import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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
    return await this.prisma.manga.findMany();
  }

  /**
   * Récupère un manga par son ID.
   * @param mangaId L'ID du manga à récupérer.
   * @returns Le manga correspondant à l'ID fourni.
   */
  async findOne(mangaId: number): Promise<Manga | null> {
    return await this.prisma.manga.findFirst({ where: { mangaId } });
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
