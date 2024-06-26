// jwt-cookie.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['token'];
    if (token) {
      req.headers['authorization'] = `Bearer ${token}`;
    }
    next();
  }
}
