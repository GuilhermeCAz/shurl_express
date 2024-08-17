import { Request, Response } from 'express';
import { AuthService } from '../service/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  if (await authService.userExists(email)) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }

  const user = await authService.register(email, password);
  res.status(201).json(user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const token = await authService.login(email, password);
  if (!token) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  res.json({ token });
});
