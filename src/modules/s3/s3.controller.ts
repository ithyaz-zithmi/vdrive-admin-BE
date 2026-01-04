import { Request, Response, NextFunction } from 'express';
import config from '../../config';
import { logger } from '../../shared/logger';
import axios from 'axios';
import https from 'https';
import { successResponse } from '../../shared/errorHandler';


export const S3Controller = {
  async generateUploadUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    const url = `${config.awsServiceUrl}/api/s3/generate-upload-url`;

    try {
      const axiosConfig: any = {
        method: 'POST', // explicit is safer
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization,
        },
        data: req.body,
          httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        timeout: 10_000,
      };

      logger.info(`Forwarding request to URL: ${url}`);

      const response = await axios(axiosConfig);

      logger.info(`Request processed successfully URL: ${url} `);
      successResponse(res, response.status, 'AdminUser updated successfully', response.data);
      return;
    } catch (error: any) {
      next(error);
    }
  },
};
