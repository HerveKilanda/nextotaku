import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

type Payload = {
  sub: number;
  email: string;
};

/**
 * Classe JwtStrategy étendant PassportStrategy pour valider le jeton JWT
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructeur de la classe JwtStrategy
   * @param configService Service de configuration pour récupérer la clé secrète
   * @param prismaService Service Prisma pour récupérer l'utilisateur à partir de la base de données
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  /**
   * Méthode validate pour valider le jeton JWT et récupérer l'utilisateur
   * @param payload Données contenues dans le jeton JWT
   * @returns Utilisateur correspondant à l'email présent dans le jeton JWT
   */
  async validate(payload: Payload) {
    const user = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      throw new UnauthorizedException('Accès refusé.');
    }
    Reflect.deleteProperty(user, 'password');
    return user;
  }
}
