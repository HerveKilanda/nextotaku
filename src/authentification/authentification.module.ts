import { Module } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { AuthentificationController } from './authentification.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategie.service';
import { PassportStrategy } from '@nestjs/passport';


@Module({
  imports : [JwtModule.register({})],
  controllers: [AuthentificationController],
  providers: [AuthentificationService,JwtStrategy],
})
export class AuthentificationModule {
 
  }

