import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  
} from '@nestjs/common';
import { inscriptionDto } from './dto/inscription';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { connexionDto } from './dto/connextion';

import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import { create } from 'domain';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/resetPassword';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation';
import { Prisma } from '@prisma/client';
import { deleteAccountDto } from './dto/deleteAccount';
import { UpdateAuthentificationDto } from './dto/update-authentification.dto';

@Injectable()
export class AuthentificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly JwtService: JwtService,
    private readonly ConfigService: ConfigService,
  ) {}

  /**
   * Méthode pour inscrire un nouvel utilisateur.
   * @param inscriptionDto Objet contenant les informations d'inscription de l'utilisateur.
   * @returns Un message de succès si l'inscription est réussie.
   * @throws HttpException avec le statut 400 (Bad Request) si l'utilisateur existe déjà.
   */
  async inscription(inscriptionDto: inscriptionDto) {
    const { email, password, username } = inscriptionDto;

    // Recherche de l'utilisateur dans la base de données par e-mail
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    // Vérification si l'utilisateur existe déjà
    if (user != null) {
      throw new HttpException(
        "L'utilisateur existe déjà",
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hachage du mot de passe avec bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur dans la base de données
    await this.prismaService.user.create({
      data: { username, email, password: hash },
    });

    await this.mailerService.confirmEmail(email);

    // Retour d'un message de succès
    return "L'utilisateur a bien été enregistré";
  }

  async connexion(connexionDto: connexionDto) {
    const { email, password } = connexionDto;
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new HttpException(
        "Le mots de passe n'est pas correct",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      sub: user.userId,
      email: user.email,
      username:user.username,
      role: user.role

    };

    const token = this.JwtService.sign(payload, {
      expiresIn: '2h',
      secret: this.ConfigService.get('JWT_SECRET'),
    });
      return {
        token
      };
  }


  /**
   * Réinitialise le mot de passe de l'utilisateur et envoie un e-mail contenant un code de réinitialisation.
   * @param ResetPasswordDto Objet contenant l'e-mail de l'utilisateur pour la réinitialisation du mot de passe.
   * @returns Un objet contenant un message de succès si l'e-mail de réinitialisation a été envoyé avec succès.
   * @throws HttpException avec le statut 404 (Not Found) si aucun utilisateur correspondant à l'e-mail n'est trouvé.
   */
  async resetPassword(
    ResetPasswordDto: ResetPasswordDto,
  ): Promise<{ data: string }> {
    // Récupération de l'e-mail de l'utilisateur à partir de ResetPasswordDto
    const { email } = ResetPasswordDto;

    // Recherche de l'utilisateur dans la base de données par e-mail
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    // Vérification si l'utilisateur existe
    if (!user) {
      // Si l'utilisateur n'existe pas, une exception est lancé
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    // Génération d'un code OTP (One-Time Password) avec speakeasy
    const code = speakeasy.totp({
      secret: this.ConfigService.get('OTP_CODE'), // Récupération de la clé secrète OTP depuis la configuration
      digits: 5, // Nombre de chiffres du code OTP
      step: 60 * 15, // Durée de validité du code (ici, 15 minutes)
      encoding: 'base32', // Encodage du code OTP
    });

    /**
     * TODO Quand tu créera ton frontend avec next.JS tu mettra un lien vers un formulaire de réinitialisation
     */
    // Construction de l'URL pour réinitialiser le mot de passe
    const url = 'http://localhost:3000/auth/reset-password';

    // Envoi de l'e-mail de réinitialisation du mot de passe
    await this.mailerService.resetPassword(user.email, url, code);

    // Retour d'un message de succès indiquant que l'e-mail de réinitialisation a été envoyé
    return {
      data: 'Le code de renouvellement de votre mot de passe a été envoyé',
    };
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur après vérification du code OTP.
   * @param ResetPasswordConfirmationDto Objet contenant les informations de réinitialisation de mot de passe.
   * @returns Un message de succès si la réinitialisation du mot de passe est réussie.
   * @throws UnauthorizedException si le code OTP est invalide ou expiré.
   */
  async resetPasswordConfimation(
    ResetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    const { email, password, code } = ResetPasswordConfirmationDto;

    // Recherche de l'utilisateur dans la base de données par e-mail
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    // Vérification si l'utilisateur existe
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérification du code OTP
    const match = speakeasy.totp.verify({
      secret: this.ConfigService.get('OTP_CODE'), // Récupération de la clé secrète OTP depuis la configuration
      token: code, // Code OTP entré par l'utilisateur
      digits: 5, // Nombre de chiffres du code OTP
      step: 60 * 15, // Durée de validité du code (ici, 15 minutes)
      encoding: 'base32', // Encodage du code OTP
    });

    // Si le code OTP est invalide ou expiré, renvoie une erreur UnauthorizedException
    if (!match) {
      throw new UnauthorizedException('Le token est invalide ou expiré');
    }
    const hash = await bcrypt.hash(password, 10);
    // Mise à jour du mot de passe de l'utilisateur dans la base de données
    await this.prismaService.user.update({
      where: { email: email }, // Utilisez le bon champ de filtrage
      data: { password: hash }, // Mettez à jour le mot de passe avec le nouveau mot de passe
    });

    // Retour d'un message de succès
    return { data: 'Mot de passe mis à jour avec succès' };
  }

  async updateUser(id : number , UpdateAuthentificationDto: UpdateAuthentificationDto) {
    
    const {password, username, email} = UpdateAuthentificationDto

    // Check if the user exists
    const user = await this.prismaService.user.findUnique({
      where: { userId: id },
    });

    // Throw NotFoundException if user does not exist
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    try {
      const hash = await bcrypt.hash(password, 10);
      const userUpdate = await this.prismaService.user.update({
        where: { userId: id },
        data: {
          email : email , 
          username : username,
          password : hash
        },
      });
      return { 
        message : "l'utilisateur à été mise à jour",
        data : UpdateAuthentificationDto
       };
    } catch (error) {
      throw new HttpException('Echec de la modification', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(userId: number) {
    // Recherche de l'utilisateur dans la base de données par ID
    const user = await this.prismaService.user.findUnique({
      where: { userId },
    });

    // Vérification si l'utilisateur existe
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Suppression de l'utilisateur de la base de données
    await this.prismaService.user.delete({
      where: { userId },
    });

    return { data: 'Le compte a été supprimé' };
  }

  
}