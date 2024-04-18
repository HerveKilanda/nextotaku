import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthentificationService } from './authentification.service';
import { JwtStrategy } from './strategie.service';
import { AuthentificationController } from './authentification.controller';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthentificationController],
  providers: [AuthentificationService, JwtStrategy],
})
export class AuthentificationModule {}
