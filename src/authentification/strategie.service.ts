import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { PrismaService } from 'src/prisma/prisma.service';

type Payload = {
  sub: number;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService, // <--- Déclarez configService ici
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user = await this.prismaService.users.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      throw new UnauthorizedException('Accès refusé.');
    }
    console.log(user);
    return user;
  }
}
