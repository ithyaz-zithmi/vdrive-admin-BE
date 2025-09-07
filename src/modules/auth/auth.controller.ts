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
      const { user_name, password } = req.body;
      const token = await AuthService.signIn({ user_name, password });
      return successResponse(
        res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' }),
        201,
        'User signed in successfully'
      );
    } catch (err) {
      next(err);
    }
  },
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_name } = req.body;
      await AuthService.forgotPassword({ user_name });
      return successResponse(res, 200, 'Forgot password link sent successfully');
    } catch (err) {
      next(err);
    }
  },
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { reset_token, new_password } = req.body;
      await AuthService.resetPassword({ reset_token, new_password });
      return successResponse(res, 200, 'Password reset successfully');
    } catch (err) {
      next(err);
    }
  },
};
