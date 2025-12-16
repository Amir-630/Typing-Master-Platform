import { NextFunction, Request, Response } from 'express';

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  res.status(status).json({
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};
