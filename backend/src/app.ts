import fastify, { FastifyInstance, FastifyError } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import dotenv from 'dotenv';
import { healthRoutes } from './modules/health/health.routes.js';
import { categoryRoutes } from './modules/categories/categories.routes.js';
import { productRoutes } from './modules/products/products.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { orderRoutes } from './modules/orders/orders.routes.js';
import { aiRoutes } from './modules/ai/ai.routes.js';

dotenv.config();

export function buildApp(): FastifyInstance {
  const isProd = process.env.NODE_ENV === 'production';

  // Strict Production Environment Validation
  if (isProd) {
    const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'COOKIE_SECRET'];
    const missing = requiredEnv.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      console.error(`FATAL: Missing required production environment variables: ${missing.join(', ')}`);
      process.exit(1);
    }

    if (
      process.env.JWT_SECRET?.includes('super-secret') ||
      process.env.COOKIE_SECRET?.includes('super-secret')
    ) {
      console.error('FATAL: Weak placeholder secrets detected in production environment!');
      process.exit(1);
    }
  }

  const app = fastify({
    logger: process.env.NODE_ENV === 'test' ? false : {
      level: isProd ? 'info' : 'debug',
    },
  });

  // Security Headers via Helmet
  app.register(helmet, {
    contentSecurityPolicy: isProd ? {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        scriptSrc: ["'self'"],
      },
    } : false,
  });

  // CORS Registration
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const corsOrigins = [
    frontendUrl,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];

  app.register(cors, {
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Cookie Registration
  app.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'super-secret-cookie-key-replace-in-production',
  });

  // JWT Registration
  app.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production',
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  // Rate Limiting
  app.register(rateLimit, {
    max: 300,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded. Please try again later.',
      },
    }),
  });

  // Register Module Routes
  app.register(healthRoutes);
  app.register(authRoutes);
  app.register(categoryRoutes);
  app.register(productRoutes);
  app.register(orderRoutes);
  app.register(aiRoutes);

  // Fallback 404 Handler
  app.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource or endpoint was not found.',
      },
    });
  });

  // Global Error Handler
  app.setErrorHandler((error: FastifyError | Error, _request, reply) => {
    app.log.error(error);

    const statusCode = ('statusCode' in error && typeof error.statusCode === 'number') ? error.statusCode : 500;
    const errorCode = ('code' in error && typeof error.code === 'string') ? error.code : 'INTERNAL_SERVER_ERROR';

    reply.status(statusCode).send({
      success: false,
      error: {
        code: errorCode,
        message: isProd && statusCode === 500 ? 'An internal server error occurred.' : error.message,
      },
    });
  });

  return app;
}
