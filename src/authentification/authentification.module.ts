import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthentificationService } from './authentification.service';
import { JwtStrategy } from './strategie.service';
import { AuthentificationController } from './authentification.controller';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Global()
@Module({
  imports: [JwtModule.register({}), ConfigModule.forRoot({
    isGlobal: true,
  }),],
  controllers: [AuthentificationController],
  providers: [
    AuthentificationService,
    JwtStrategy,
    ConfigService
    
  ],
})
export class AuthentificationModule {}
