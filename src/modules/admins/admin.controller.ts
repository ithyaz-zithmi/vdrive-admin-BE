import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { successResponse } from '../../shared/errorHandler';

export const AdminController = {
  async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await AdminService.getAllAdmins();
      return successResponse(res, 200, 'Admins fetched successfully', admins);
    } catch (err) {
      next(err);
    }
  },

  async getAdminById(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await AdminService.getAdminById(req.params.id);
      if (!admin) {
        throw { statusCode: 404, message: 'Admin not found' };
      }
      return successResponse(res, 200, 'Admin fetched successfully', admin);
    } catch (err) {
      next(err);
    }
  },

  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await AdminService.createAdmin(req.body);
      return successResponse(res, 201, 'Admin created successfully', admin);
    } catch (err) {
      // Handle unique constraint violations if possible, or let global handler do it
      next(err);
    }
  },

  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await AdminService.updateAdmin(req.params.id, req.body);
      if (!admin) {
        throw { statusCode: 404, message: 'Admin not found' };
      }
      return successResponse(res, 200, 'Admin updated successfully', admin);
    } catch (err) {
      next(err);
    }
  },

  async deleteAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await AdminService.deleteAdmin(req.params.id);
      if (!success) {
        throw { statusCode: 404, message: 'Admin not found' };
      }
      return successResponse(res, 200, 'Admin deleted successfully', null);
    } catch (err) {
      next(err);
    }
  }
};
