// src/modules/users/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AdminUserService } from './adminUser.service';
import { successResponse } from '../../shared/errorHandler';

export const AdminUserController = {
  async getAdminUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUsers = await AdminUserService.getAdminUsers();
      return successResponse(res, 200, 'AdminUsers fetched successfully', adminUsers);
    } catch (err) {
      next(err);
    }
  },

  async getAdminUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUser = await AdminUserService.getAdminUserById(req.params.id);
      return successResponse(res, 200, 'AdminUser fetched successfully', adminUser);
    } catch (err) {
      next(err);
    }
  },

  async createAdminUser(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUser = await AdminUserService.createAdminUser(req.body);
      return successResponse(res, 201, 'AdminUser created successfully', adminUser);
    } catch (err) {
      next(err);
    }
  },

  async updateAdminUser(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUser = await AdminUserService.updateAdminUser(req.params.id, req.body);
      return successResponse(res, 200, 'AdminUser updated successfully', adminUser);
    } catch (err) {
      next(err);
    }
  },

  async deleteAdminUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminUserService.deleteAdminUser(req.params.id);
      return successResponse(res, 200, result.message);
    } catch (err) {
      next(err);
    }
  },
};
