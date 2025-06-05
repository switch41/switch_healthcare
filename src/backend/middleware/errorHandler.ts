import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error('Operational error:', {
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
    });

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    logger.error('Validation error:', {
      message: err.message,
      stack: err.stack,
    });

    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
    return;
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    logger.error('Cast error:', {
      message: err.message,
      stack: err.stack,
    });

    res.status(400).json({
      status: 'fail',
      message: 'Invalid ID format',
    });
    return;
  }

  // Handle Mongoose duplicate key errors
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    logger.error('Duplicate key error:', {
      message: err.message,
      stack: err.stack,
    });

    res.status(400).json({
      status: 'fail',
      message: 'Duplicate field value entered',
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    logger.error('JWT error:', {
      message: err.message,
      stack: err.stack,
    });

    res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    logger.error('JWT expired:', {
      message: err.message,
      stack: err.stack,
    });

    res.status(401).json({
      status: 'fail',
      message: 'Your token has expired. Please log in again.',
    });
    return;
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    logger.error('Zod validation error:', {
      message: err.message,
      stack: err.stack,
    });

    res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors: (err as any).errors,
    });
    return;
  }

  // Handle unknown errors
  logger.error('Unknown error:', {
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
}; 