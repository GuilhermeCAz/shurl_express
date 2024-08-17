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

/**
 * @swagger
 * /urls:
 *   get:
 *     summary: List all URLs created by the authenticated user
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/URL'
 *       401:
 *         description: Unauthorized
 */
router.get('/urls', authenticateToken, listURLs);

/**
 * @swagger
 * /urls:
 *   post:
 *     summary: Shorten a new URL
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalURL
 *             properties:
 *               originalURL:
 *                 type: string
 *                 example: https://example.com
 *     responses:
 *       201:
 *         description: URL shortened successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/URL'
 *       400:
 *         description: Invalid URL
 */
router.post('/urls', validateURL, shortenURL);

/**
 * @swagger
 * /urls/{slug}:
 *   patch:
 *     summary: Update the original URL of an existing shortened URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the shortened URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalURL
 *             properties:
 *               originalURL:
 *                 type: string
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: URL updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/URL'
 *       400:
 *         description: Invalid URL
 *       404:
 *         description: URL not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/urls/:slug', authenticateToken, updateURL);

/**
 * @swagger
 * /urls/{slug}:
 *   delete:
 *     summary: Delete a shortened URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the shortened URL
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *       404:
 *         description: URL not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/urls/:slug', authenticateToken, deleteURL);

/**
 * @swagger
 * /{slug}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the shortened URL
 *     responses:
 *       302:
 *         description: Redirect to the original URL
 *       404:
 *         description: URL not found
 */
router.get('/:slug', redirectURL);

export default router;
