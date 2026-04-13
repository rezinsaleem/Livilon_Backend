import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/customError';
import { sendError } from '../utils/apiResponse.util';
import { HTTP_STATUS } from '../constants/httpStatus';
import { MESSAGES } from '../constants/messages';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // AppError (operational)
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, HTTP_STATUS.BAD_REQUEST, MESSAGES.VALIDATION_ERROR, errors);
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    sendError(
      res,
      HTTP_STATUS.CONFLICT,
      `Duplicate value for field: ${field}`
    );
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    sendError(res, HTTP_STATUS.BAD_REQUEST, err.message);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid ID format');
    return;
  }

  // Unhandled errors
  console.error('❌ Unhandled error:', err);
  sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.INTERNAL_ERROR);
};
