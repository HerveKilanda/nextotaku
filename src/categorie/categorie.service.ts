import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { Categorie } from './entities/categorie.entity';

@Injectable()
export class CategorieService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Crée une nouvelle catégorie.
   *
   * @param {CreateCategorieDto} createCategorieDto - Les données nécessaires pour créer une nouvelle catégorie.
   * @return {Promise<Categorie>} La catégorie nouvellement créée.
   */
  async create(createCategorieDto: CreateCategorieDto) {
    const categorie = await this.prisma.categorie.create({
      data: createCategorieDto.nom,
    });
    return categorie;
  }

  /**
   * Récupère toutes les catégories.
   *
   * @return {Promise<Categorie[]>} Les catégories récupérées.
   */
  async findAll() {
    const categorie = await this.prisma.categorie.findMany();
    return categorie;
  }

/**
 * Récupère une seule catégorie en fonction de son ID.
 *
 * @param {number} id - L'ID de la catégorie à récupérer.
 * @return {Promise<Categorie>} La catégorie récupérée.
 * @throws {NotFoundException} Si la catégorie avec l'ID spécifié n'est pas trouvée.
 */
  async findOne(id: number) {
    const categorie = await this.prisma.categorie.findUnique({
      where: { categorieId: id },
    });
    if (!categorie)
      throw new NotFoundException("la categorie n'a pas été trouvé");
    return categorie;
  }

  /**
   * Met à jour une catégorie avec l'ID spécifié.
   *
   * @param {number} id - L'ID de la catégorie à mettre à jour.
   * @param {UpdateCategorieDto} updateCategorieDto - Les données à mettre à jour la catégorie avec.
   * @return {Promise<{ status: string, message: string, data: Category }>} - Une promesse qui se résout en un objet contenant le statut, le message et les données de la catégorie mise à jour.
   * @throws {NotFoundException} - Si la catégorie avec l'ID spécifié n'est pas trouvée.
   */
  async update(id: number, updateCategorieDto: UpdateCategorieDto) {
    const existingCategorie = await this.prisma.categorie.findUnique({
      where: { categorieId: id },
    });
    if (!existingCategorie) {
      throw new NotFoundException('Category non trouvé');
    }
    const updatedCategorie = await this.prisma.categorie.update({
      where: { categorieId: id },
      data: updateCategorieDto,
    });
    return {
      status: 'success',
      message: 'la catégorie à été mis a jour',
      data: updatedCategorie,
    };
  }
  
  /**
   * Supprime une catégorie avec l'ID spécifié.
   *
   * @param {number} id - L'ID de la catégorie à supprimer.
   * @return {string} Un message indiquant si la catégorie a été supprimée avec succès.
   */
  async remove(id: number) {
    try {
      const categorie = await this.prisma.categorie.findUnique({
        where: { categorieId: id },
      });
      if (!categorie) {
        throw new NotFoundException('Categorie non trouvé');
      }
      await this.prisma.categorie.delete({
        where: { categorieId: id },
      });
      return 'La catégorie a bien été supprimé';
    } catch (error) {
      throw new Error('échec de la suppression de la catégorie');
    }
  }
}
