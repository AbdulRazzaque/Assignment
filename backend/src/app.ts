import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rateLimiter.middleware';
import { AppError } from './utils/appError';
import { env } from './config/env';

const app: Application = express();

// Trust proxy for rate limiting & secure cookies behind Vercel / reverse proxies
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());

// CORS Configuration with Credentials support
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      if (
        env.NODE_ENV !== 'production' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  })
);

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Global API Rate Limiter
app.use('/api', apiRateLimiter);

// API Base Routes
app.use('/api/v1', routes);

// 404 Handler for undefined routes
app.use('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Cannot find ${req.method} ${req.originalUrl} on this server`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
