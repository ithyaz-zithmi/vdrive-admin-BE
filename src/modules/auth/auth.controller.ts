// src/modules/users/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { successResponse } from '../../shared/errorHandler';

export const AuthController = {
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const adminData = { ...req.body, role: 'admin' as const };
      const newAdmin = await AuthService.createAdmin(adminData);
      return successResponse(res, 201, 'Admin user created successfully', newAdmin);
    } catch (err) {
      next(err);
    }
  },
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName, password } = req.body;
      const token = await AuthService.signIn({ userName, password });
      return successResponse(res, 200, 'Sign-in successful', { token });
    } catch (err) {
      next(err);
    }
  },
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName } = req.body;
      await AuthService.forgotPassword({ userName });
      return successResponse(res, 200, 'Forgot password link sent successfully');
    } catch (err) {
      next(err);
    }
  },
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { resetToken, newPassword } = req.body;
      await AuthService.resetPassword({ resetToken, newPassword });
      return successResponse(res, 200, 'Password reset successfully');
    } catch (err) {
      next(err);
    }
  },
};
