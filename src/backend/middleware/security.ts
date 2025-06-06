import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
      };
    }
  }
}

export const setupSecurity = async () => {
  try {
    // Add any additional security setup here
    // No JWT authentication required
    logger.info('Security middleware initialized');
  } catch (error) {
    logger.error('Failed to initialize security middleware:', error);
    throw error;
  }
}; 