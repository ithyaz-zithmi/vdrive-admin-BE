// src/app.ts
import express from 'express';
import { errorHandler } from './shared/errorHandler';
import { logger } from './shared/logger';
import { middlewares } from './shared/middlewares';
import routes from "./routes";
import xssClean from 'xss-clean';
import {  databaseMiddleware } from './shared/database';

const app = express();
// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(xssClean());

// Core middlewares
app.use(middlewares.requestId);
app.use(middlewares.requestLogger);
app.use(middlewares.rateLimiter);
app.use(middlewares.security);
app.use(middlewares.corsMiddleware);
app.use(middlewares.compressionMiddleware);
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.use(databaseMiddleware)

// Routes
app.use("/api", routes);



// 404 handler (catch-all)
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling (must be last)
app.use(errorHandler);

export default app;
