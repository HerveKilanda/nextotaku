import { Request, Response, NextFunction } from 'express';

export function localsData(req: any, res: Response, next: NextFunction) {
  console.log(req.session)
  res.locals.connected = req.session?.connected;
  res.locals.user = req.session?.user;
  next();
}
