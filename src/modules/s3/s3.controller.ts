import { Request, Response, NextFunction } from 'express';
import config from '../../config';
import { logger } from '../../shared/logger';
import axios from 'axios';
import { successResponse } from '../../shared/errorHandler';

export const S3Controller = {
  async generateUploadUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    const url = `${config.userDriverApiUrl}/api/s3/presigned-url`;

    try {
      const axiosConfig = {
        method: 'POST', // explicit is safer
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
          'x-api-key': config.internalServiceApiKey,
        },
        data: req.body,
        timeout: 10_000,
      };

      logger.info(`Forwarding request to URL: ${url}`);

      const response = await axios(axiosConfig);

      logger.info(`Request processed successfully URL: ${url} `);
      res.status(response.status).json(response.data);
    } catch (error: any) {
      next(error);
    }
  },
};
