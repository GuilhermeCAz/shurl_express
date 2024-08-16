import { Router } from 'express';
import { redirectURL, shortenURL } from '../controllers/urlController';

const router = Router();

router.post('/', shortenURL);
router.get('/:slug', redirectURL);

export default router;
