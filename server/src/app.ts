import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler, AppError } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import { ENV } from './config/env';

export function createApp(): Application {
  const app = express();

  // 1. Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Allow flex embed and external hosted redirect
    })
  );

  // 2. CORS
  app.use(
    cors({
      origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Signature', 'X-Requested-With'],
    })
  );

  // 3. Body Parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 4. Request Logging
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
  }

  // 5. General Rate Limiter
  app.use('/api', generalLimiter);

  // 6. API Routes
  app.use('/api', routes);

  // 7. 404 Handler
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Endpoint not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
  });

  // 8. Global Error Handler
  app.use(errorHandler);

  return app;
}
