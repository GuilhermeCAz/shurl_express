import { Router } from 'express';
import {
  deleteURL,
  listURLs,
  redirectURL,
  shortenURL,
  updateURL,
} from '../controllers/urlController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateURL } from '../middleware/urlValidatorMiddleware.js';

const router = Router();

router.get('/urls', authenticateToken, listURLs);
router.post('/urls', validateURL, shortenURL);
router.patch('/urls/:slug', authenticateToken, updateURL);
router.delete('/urls/:slug', authenticateToken, deleteURL);
router.get('/:slug', redirectURL);

export default router;
