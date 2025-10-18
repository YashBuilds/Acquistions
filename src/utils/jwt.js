import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-please-change-in-production';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
  // Create JWT
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (e) {
      logger.error('Failed to sign JWT token', { error: e });
      throw new Error('Failed to sign JWT token');
    }
  },

  // Verify JWT
  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      logger.error('Failed to verify JWT token', { error: e });
      throw new Error('Invalid or expired JWT token');
    }
  },
};
