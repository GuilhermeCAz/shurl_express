import { Router } from 'express';
import {
  deleteURL,
  listURLs,
  redirectURL,
  shortenURL,
  updateURL,
} from '../controllers/urlController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/urls', authenticateToken, listURLs);
router.post('/urls', shortenURL);
router.patch('/urls/:slug', authenticateToken, updateURL);
router.delete('/urls/:slug', authenticateToken, deleteURL);
router.get('/:slug', redirectURL);

export default router;
