// src/shared/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';

const SERVICE_NAME = process.env.SERVICE_NAME || 'driver-booking-service';
const VERSION = process.env.API_VERSION || 'v1';

const buildResponse = (
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null,
  error: any = null,
  requestId?: string
) => {
  return {
    statusCode,
    success,
    message,
    data,
    meta: {
      requestId: requestId || uuidv4(),
      timestamp: new Date().toISOString(),
      service: SERVICE_NAME,
      version: VERSION,
    },
    error,
  };
};

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null,
  requestId?: string
) => {
  return res
    .status(statusCode)
    .json(buildResponse(statusCode, true, message, data, null, requestId));
};

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req as any).requestId || uuidv4();
  const statusCode = err.statusCode || 500;

  const error = {
    code: err.code || mapStatusCodeToErrorCode(statusCode),
    details: err.details || err.message || 'An unexpected error occurred',
  };

  logger.error(`[${requestId}] ${err.stack || err.message}`);

  return res
    .status(statusCode)
    .json(
      buildResponse(
        statusCode,
        false,
        err.message || 'Internal server error',
        null,
        error,
        requestId
      )
    );
};

const mapStatusCodeToErrorCode = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'AUTH_FAILED';
    case 403:
      return 'ACCESS_DENIED';
    case 404:
      return 'RESOURCE_NOT_FOUND';
    case 500:
    default:
      return 'SERVER_ERROR';
  }
};
