import { Express } from 'express';
import { errorHandler } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

// Import route modules
import authRoutes from './auth.routes.js';
import { patientRouter } from './patient.router.js';
import { medicalRecordRouter } from './medical-record.router.js';
import providerRoutes from './provider.routes.js';
import chatRoutes from './chat.router.js';
import healthRoutes from './health.routes.js';

export const setupRoutes = (app: Express) => {
  // Health check endpoint (public)
  app.use('/api/health', healthRoutes);

  // Auth routes (public)
  app.use('/api/auth', authRoutes);

  // Protected routes - now public (no authentication)
  app.use('/api/patients', patientRouter);
  app.use('/api/medical-records', medicalRecordRouter);
  app.use('/api/providers', providerRoutes);
  app.use('/api/chat', chatRoutes);

  // Global error handler
  app.use(errorHandler);

  // 404 handler
  app.use((req, res) => {
    logger.warn(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });
};
