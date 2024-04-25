import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Emprunt, Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmpruntDto } from './dto/create-emprunt.dto';
import { UpdateEmpruntDto } from './dto/update-emprunt.dto';

@Injectable()
export class EmpruntService {
 
  constructor(private readonly prismaService: PrismaService) {}

  // Méthode pour créer un nouvel emprunt
  async create(createEmpruntDto: CreateEmpruntDto) {
    // Extraction des valeurs du DTO
    const { mangaId, userId } = createEmpruntDto;

    // Vérifier si mangaId et userId sont fournis
    if (!mangaId || !userId) {
      throw new BadRequestException(
        'Invalid input: mangaId et userId sont requis',
      );
    }

    // Vérifier si un emprunt existe déjà pour ce manga et cet utilisateur
    const existingEmprunt = await this.prismaService.emprunt.findFirst({
      where: { userId, mangaId },
    });

    if (existingEmprunt) {
      throw new ConflictException(
        'Le manga est déjà emprunté par cet utilisateur',
      );
    }

    // Vérifier si le manga est disponible (non emprunté)
    const manga = await this.prismaService.manga.findFirst({
      where: { mangaId, status: Status.LIBRE },
    });

    if (!manga) {
      throw new ConflictException("Le manga n'existe pas ou est déjà emprunté");
    }

    // Calculer la date de début (au moment de l'emprunt)
    const dateDebut = new Date();

    // Calculer la date de fin (3 jours à partir de la date de début)
    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateFin.getDate() + 3);

    // Créer un nouvel emprunt dans la base de données
    return this.prismaService.emprunt.create({
      data: {
        manga: { connect: { mangaId } },
        user: { connect: { userId } },
        dateDebut,
        dateFin,
      },
    });
  }

  /**
   * Récupère tous les emprunts de manga pour un utilisateur donné.
   *
   * @param {number} userId - L'ID de l'utilisateur pour lequel récupérer les emprunts.
   * @param {number} mangaId - L'ID du manga pour lequel récupérer les emprunts.
   * @return {Promise<Emprunt[]>} Les emprunts de manga correspondants aux IDs fournis.
   */
  async findAllEmprunt(userId: number, mangaId: number) {
    const emprunts = await this.prismaService.emprunt.findMany({
      where: { userId, mangaId },
    });
    return emprunts;
  }
  /**
   * Met à jour un emprunt existant.
   *
   * @param {number} empruntsId - L'ID de l'emprunt à mettre à jour.
   * @param {UpdateEmpruntDto} updateEmpruntDto - Les données mises à jour de l'emprunt.
   * @return {Promise<Emprunt>} L'emprunt mis à jour avec succès.
   * @throws {HttpException} - Si l'emprunt n'est pas trouvé.
   */
  async update(empruntsId: number, updateEmpruntDto: UpdateEmpruntDto) {
    // Check if the emprunt exists
    const existingEmprunt = await this.prismaService.emprunt.findUnique({
      where: { empruntsId },
    });

    if (!existingEmprunt) {
      throw new NotFoundException('Emprunt not found');
    }

    try {
      // Get the current date
      const currentDate = new Date();
      // Add 3 days to the current date
      const dateFin = new Date(currentDate.setDate(currentDate.getDate() + 3));

      // Update the emprunt with the new dateFin
      const updatedEmprunt = await this.prismaService.emprunt.update({
        where: { empruntsId },
        data: { dateFin },
      });

      return updatedEmprunt;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update emprunt');
    }
  }

  /**
   * Supprime un emprunt par son ID.
   *
   * @param {number} empruntsId - L'ID de l'emprunt à supprimer.
   * @return {Promise<{ message: string }>} - Une promesse qui se résout en un objet contenant un message indiquant la réussite de la suppression.
   * @throws {HttpException} - Si l'emprunt n'est pas trouvé.
   */
  async delete(empruntsId: number): Promise<{ message: string }> {
    const deletedEmprunt = await this.prismaService.emprunt.delete({
      where: { empruntsId: empruntsId }, // Assurez-vous d'inclure l'identifiant ici
    });

    if (!deletedEmprunt) {
      throw new HttpException(
        "L'emprunt n'a pas été trouvé",
        HttpStatus.NOT_FOUND,
      );
    }

    return { message: "L'emprunt a été supprimé" };
  }
}
