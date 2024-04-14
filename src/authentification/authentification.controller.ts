import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { inscriptionDto } from './dto/inscription';
import { UpdateAuthentificationDto } from './dto/update-authentification.dto';
import { connexionDto } from './dto/connextion';
import { ResetPasswordDto } from './dto/resetPassword';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation';




@Controller('auth')
export class AuthentificationController {
  constructor(private readonly AuthentificationService: AuthentificationService) {}

  @Post('inscription')
  inscrption(@Body() inscriptionDto: inscriptionDto) {
    return this.AuthentificationService.inscription(inscriptionDto);
  }
  @Post('connexion')
  connexion(@Body() connexionDto: connexionDto) {
    return this.AuthentificationService.connexion(connexionDto);
  }
  @Post("reset-password")
  resetPassword(@Body() resetPasswordDto : ResetPasswordDto){
    return this.AuthentificationService.resetPassword(resetPasswordDto);
  }
  @Post("reset-password-confirmation")
  resetPasswordConfirmation(@Body() resetPasswordConfirmationDto : ResetPasswordConfirmationDto){
    return this.AuthentificationService.resetPasswordConfimation(resetPasswordConfirmationDto);
  }
 
  @Delete("delete")
  deleteAccount(){
    return "compte supprimer"
  }
    
  


}
