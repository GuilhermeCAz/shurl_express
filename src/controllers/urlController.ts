import { Request, Response } from 'express';
import { URLService } from '../service/urlService';
import { asyncHandler } from '../utils/asyncHandler';

const urlService = new URLService();

export const shortenURL = asyncHandler(async (req: Request, res: Response) => {
  let { originalURL } = req.body as { originalURL: string };

  if (!originalURL) res.status(400).json({ error: 'URL is required' });

  if (!/^http?:\/\//iu.test(originalURL))
    originalURL = `https://${originalURL}`;

  const result = await urlService.shortenURL(originalURL);
  res.json(result);
});

export const redirectURL = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params,
    result = await urlService.getOriginalURL(slug);

  if (result) res.redirect(result.originalURL);
  else res.status(404).json({ error: 'URL not found' });
});
