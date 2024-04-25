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

@ApiTags("authentification")
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
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(
    @Param('id') id: string,
    @Body() deleteAccountDto: deleteAccountDto,
  ) {
    return this.AuthentificationService.deleteUser(
      Number(id),
      deleteAccountDto,
    );
  }
}

