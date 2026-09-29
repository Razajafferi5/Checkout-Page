import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const errorCode = err instanceof AppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Internal server error';

  logger.error(`API Error [${req.method} ${req.originalUrl}]`, err, {
    statusCode,
    errorCode,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
}
