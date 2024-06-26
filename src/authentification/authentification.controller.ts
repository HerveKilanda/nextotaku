import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Redirect,
  Req,
  UseGuards,
  Session,
  Res,
  HttpCode
} from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { inscriptionDto } from './dto/inscription';
import { UpdateAuthentificationDto } from './dto/update-authentification.dto';
import { connexionDto } from './dto/connextion';
import { ResetPasswordDto } from './dto/resetPassword';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation';
import { AuthGuard } from '@nestjs/passport';
import { request, Request, Response } from 'express';
import { deleteAccountDto } from './dto/deleteAccount';
import { ExternalExceptionFilter } from '@nestjs/core/exceptions/external-exception-filter';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { userInfo } from 'os';
import { localsData } from 'src/middlewares/localData';
import {  SessionData } from 'express-session';

 // Assurez-vous que le chemin d'importation est correct


@ApiTags('authentification')
@Controller('auth')
export class AuthentificationController {
  constructor(
    private readonly AuthentificationService: AuthentificationService,
  ) {}

  @Post('inscription')
  @Redirect('/auth/connexion')
  inscrption(@Body() inscriptionDto: inscriptionDto) {
    return this.AuthentificationService.inscription(inscriptionDto);
  }

  @Post('connexion')
  async connexion(@Body() connexionDto: connexionDto, @Res() res: Response) {
    try {
      const user = await this.AuthentificationService.connexion(connexionDto);

      res.cookie('token', user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2 * 60 * 60 * 1000, // 2 heures
        sameSite: 'strict',
      });


      return res.json({
        message: 'Connexion réussie',
        

      });
    } catch (error) {
      throw new HttpException('Connexion échouée', HttpStatus.UNAUTHORIZED);
    }
  }
  

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.AuthentificationService.resetPassword(resetPasswordDto);
  }

  @Post('reset-password-confirmation')
  resetPasswordConfirmation(
    @Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto,
  ) {
    return this.AuthentificationService.resetPasswordConfimation(
      resetPasswordConfirmationDto,
    );
  }
  @Post('deconnexion') // Ajoutez ce décorateur pour spécifier la méthode HTTP
  deconnexion(@Res() res: Response, @Session() session: Record<string, any>) {
    session.destroy((err) => {
      if (err) {
        console.error(err);
        throw new HttpException(
          'Erreur de serveur',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).send({ message: 'Déconnexion réussie' });
      }
    });
  }
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateAuthentificationDto: UpdateAuthentificationDto,
  ) {
    return this.AuthentificationService.updateUser(
      Number(id),
      UpdateAuthentificationDto,
    );
  }

  // Décorateur pour spécifier les rôles autorisés
  @UseGuards(AuthGuard('jwt')) // Utilisation de plusieurs gardes
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return this.AuthentificationService.deleteUser(Number(userId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  getUserConnected(@Req() req: Request) {
    if (!req.user) {
      throw new HttpException('Utilisateur non authentifié', HttpStatus.UNAUTHORIZED);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Utilisateur connecté',
      data: req.user,
    };
  }
  
}