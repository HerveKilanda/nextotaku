import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { Manga } from './entities/manga.entity';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';

@Injectable()
export class MangaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Crée un nouveau manga.
   * @param createMangaDto Les données du manga à créer.
   * @param userId L'ID de l'utilisateur créant le manga.
   * @returns Un message indiquant que le manga a été créé avec succès.
   */
  // async createManga(createMangaDto: CreateMangaDto, userId: any) {
  //   const { titre, description, categorieId, imageUrl} = createMangaDto;
  //   await this.prisma.manga.create({
  //     data: { titre, description, categorieId, userId, imageUrl},
  //   });
  //   return { data: 'Manga créé' };
  // }

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

  async fetchMangaDetails(mangaId: number): Promise<Manga> {
    const urlManga = `https://api.jikan.moe/v4/manga/moreinfo;`;

    try {
      const data = await lastValueFrom(
        this.httpService.get(urlManga).pipe(map((response) => response.data)),
      );
      if (!data) {
        throw new NotFoundException("Manga avec l'ID ${mangaId} non trouvé");
      }
      return data;
    } catch (error) {
      console.error('Erreur dans la récupération du manga', error.message);
      if (error.data.status && error.data === 404) {
        throw new NotFoundException("Manga avec l'ID ${mangaId} non trouvé");
      } else {
        throw new HttpException(
          'Erreur dans la récuperation du details du manga',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async fetchAndStoreMangas(): Promise<Manga[]> {
    const url = `https://api.jikan.moe/v4/manga`;
    try {
      const response = await lastValueFrom(
        this.httpService.get(url).pipe(map((res) => res.data)),
      );
      const mangas = response.data;
      const storeMangas = await Promise.all(
        mangas.map(async (manga) => {
          const { mal_id, title, synopsis, images, genres } = manga;
          const existingManga = await this.prisma.manga.findUnique({
            where: { mangaId: mal_id },
          });
          if (!existingManga) {
            const genreIds = await Promise.all(
              genres.map(async (genre) => {
                let existingGenre = await this.prisma.categorie.findFirst({
                  where: { nom: genre.name },
                });
                existingGenre = await this.prisma.categorie.create({
                  data: { nom: genre.name },
                });
                return existingGenre.categorieId;
              }),
            );
            return this.prisma.manga.create({
              data: {
                mangaId: mal_id,
                titre: title,
                description: synopsis,
                imageUrl: images.jpg.large_image_url,
                categorieId: genreIds[0],
                userId: 1,
              },
            });
          }
          return existingManga;
        }),
      );
      return storeMangas;
    } catch (error) {
      console.error('erreur de recuperation et stockage des mangas', error);
      throw new HttpException(
        'Echec de récupération et de stockage des mangas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async fetchMangaById(mangaId: number): Promise<Manga> {
    const manga = await this.prisma.manga.findUnique({ where: { mangaId } });

    if (!manga) {
      throw new NotFoundException(`Manga with ID ${mangaId} not found`);
    }

    return manga;
  }
}
