import { config } from './index.js';
import { logger } from '../utils/logger.js';

export const initializeDatabase = async () => {
  try {
    // No need to initialize database connection since we're using Supabase
    logger.info('Database initialization skipped - using Supabase');
    return true;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};
