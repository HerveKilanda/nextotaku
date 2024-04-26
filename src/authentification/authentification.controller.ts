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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { inscriptionDto } from './dto/inscription';
import { UpdateAuthentificationDto } from './dto/update-authentification.dto';
import { connexionDto } from './dto/connextion';
import { ResetPasswordDto } from './dto/resetPassword';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation';
import { AuthGuard } from '@nestjs/passport';
import { request, Request } from 'express';
import { deleteAccountDto } from './dto/deleteAccount';
import { ExternalExceptionFilter } from '@nestjs/core/exceptions/external-exception-filter';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
 // Assurez-vous que le chemin d'importation est correct


@ApiTags('authentification')
@Controller('auth')
export class AuthentificationController {
  constructor(
    private readonly AuthentificationService: AuthentificationService,
  ) {}

  @Post('inscription')
  inscrption(@Body() inscriptionDto: inscriptionDto) {
    return this.AuthentificationService.inscription(inscriptionDto);
  }

  @Post('connexion')
  connexion(@Body() connexionDto: connexionDto) {
    return this.AuthentificationService.connexion(connexionDto);
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

   // Décorateur pour spécifier les rôles autorisés
  @UseGuards(AuthGuard('jwt')) // Utilisation de plusieurs gardes
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return this.AuthentificationService.deleteUser(Number(userId));
  }
}
