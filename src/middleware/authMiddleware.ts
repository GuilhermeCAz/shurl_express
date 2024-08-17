import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../service/authService';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization,
    token = authHeader?.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  const user = AuthService.verifyToken(token);

  if (!user) {
    res.sendStatus(403);
    return;
  }

  next();
};
