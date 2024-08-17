import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { URLService } from '../service/urlService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const urlService = new URLService(),
  extractUserFromToken = (req: Request): { id: string } | null => {
    const authHeader = req.headers.authorization,
      token = authHeader?.split(' ')[1];

    if (!token) return null;

    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch {
      return null;
    }
  };

export const shortenURL = asyncHandler(async (req: Request, res: Response) => {
  const user = extractUserFromToken(req);
  let { originalURL } = req.body as { originalURL: string };

  if (!originalURL) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  if (!/^http?:\/\//iu.test(originalURL))
    originalURL = `https://${originalURL}`;

  const result = await urlService.shortenURL(originalURL, user?.id);
  res.json(result);
});

export const redirectURL = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params,
    result = await urlService.getOriginalURL(slug);

  if (result) res.redirect(result.originalURL);
  else res.status(404).json({ error: 'URL not found' });
});

export const updateURL = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params,
    { originalURL } = req.body as { originalURL: string },
    user = extractUserFromToken(req);

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!originalURL) res.status(400).json({ error: 'originalURL is required' });

  const updatedURL = await urlService.updateURL(slug, user.id, originalURL);

  if (updatedURL) res.json(updatedURL);
  else res.status(404).json({ error: 'URL not found or not owned by user' });
});

export const listURLs = asyncHandler(async (req: Request, res: Response) => {
  const user = extractUserFromToken(req);

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const urls = await urlService.listURLs(user.id);
  res.json(urls);
});

export const deleteURL = asyncHandler(async (req: Request, res: Response) => {
  const user = extractUserFromToken(req);

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { slug } = req.params;
  await urlService.deleteURL(slug, user.id);
  res.status(204).send();
});
