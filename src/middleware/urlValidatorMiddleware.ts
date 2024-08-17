/* eslint-disable camelcase */
import { body } from 'express-validator';

export const validateURL = [
  body('originalURL')
    .isURL({
      protocols: ['http', 'https'],
      require_valid_protocol: true,
      require_protocol: true,
    })
    .withMessage('Invalid URL format'),
];
