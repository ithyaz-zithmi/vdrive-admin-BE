import { Request, Response, NextFunction } from 'express';
import { userDriverClient } from '../../utilities/httpClient';
import { successResponse } from '../../shared/errorHandler';
import { logger } from '../../shared/logger';

export const UserManagementController = {
  async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await userDriverClient.get('/api/users/customers', {
        params: req.query,
      });
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      logger.error(`getCustomers proxy error: ${err.message}`);
      next(err);
    }
  },

  async getDrivers(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await userDriverClient.get('/api/users/drivers', {
        params: req.query,
      });
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      logger.error(`getDrivers proxy error: ${err.message}`);
      next(err);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await userDriverClient.get(`/api/users/${id}`);
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      logger.error(`getUserById proxy error: ${err.message}`);
      next(err);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await userDriverClient.post('/api/users/create', req.body);
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      logger.error(`createUser proxy error: ${err.message}`);
      next(err);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await userDriverClient.patch(`/api/users/update/${id}`, req.body);
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      logger.error(`updateUser proxy error: ${err.message}`);
      next(err);
    }
  },

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await userDriverClient.patch(`/api/users/block/${id}`);
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      logger.error(`blockUser proxy error: ${err.message}`);
      next(err);
    }
  },

  async unblockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await userDriverClient.patch(`/api/users/unblock/${id}`);
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      logger.error(`unblockUser proxy error: ${err.message}`);
      next(err);
    }
  },

  async disableUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await userDriverClient.patch(`/api/users/disable/${id}`);
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      logger.error(`disableUser proxy error: ${err.message}`);
      next(err);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await userDriverClient.delete(`/api/users/delete/${id}`);
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      logger.error(`deleteUser proxy error: ${err.message}`);
      next(err);
    }
  },
};
