import { Router } from 'express';
import {
  deleteURL,
  listURLs,
  redirectURL,
  shortenURL,
} from '../controllers/urlController';

const router = Router();

router.post('/', shortenURL);
router.get('/url', listURLs);
router.get('/:slug', redirectURL);
router.delete('/:slug', deleteURL);

export default router;
