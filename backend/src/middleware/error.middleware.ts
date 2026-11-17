import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { env } from '../config/env';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

export const errorHandler = (
  err: Error | AppError | MongoError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown[] | undefined = undefined;

  // 1. Custom Application Error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // 2. Mongoose Duplicate Key Error (e.g., unique email)
  else if ((err as MongoError).code === 11000) {
    statusCode = 409;
    const mongoErr = err as MongoError;
    const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : 'field';
    message = `An account with this ${field} already exists.`;
  }
  // 3. Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    const validationErrors = (err as MongoError).errors;
    if (validationErrors) {
      errors = Object.values(validationErrors).map((e) => ({
        message: e.message,
      }));
    }
  }
  // 4. Mongoose Bad ObjectId / Cast Error
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier format.';
  }
  // 5. JWT Errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token is invalid or expired.';
  } else {
    // Unexpected error
    logger.error('Unhandled Server Error:', err);
    if (env.NODE_ENV === 'development') {
      message = err.message || message;
    }
  }

  ApiResponse.error(res, message, statusCode, errors);
};
