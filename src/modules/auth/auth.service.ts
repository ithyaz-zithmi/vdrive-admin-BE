// src/modules/users/user.service.ts
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { sendMail } from '../../shared/sendEmail';
import { User } from '../users/user.model';

export const AuthService = {
  generateResetToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },
  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },
  checkUserName(userName: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex = /^\d{7,15}$/;

    if (emailRegex.test(userName)) {
      return 'Email';
    } else if (phoneRegex.test(userName)) {
      return 'Phone number';
    } else {
      return 'Invalid input';
    }
  },
  async createAdmin(data: {
    name: string;
    password: string;
    contact: string;
    alternateContact: string;
    role: string;
  }): Promise<User> {
    const hashedPassword = await AuthService.hashPassword(data.password);
    return await AuthRepository.createAdmin({ ...data, password: hashedPassword });
  },
  async signIn(data: { userName: string; password: string }): Promise<string> {
    let userData = await AuthRepository.getUserData({ userName: data?.userName });
    if (!userData) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }
    const isPasswordValid = await AuthService.validatePassword(data?.password, userData?.password);
    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }
    const token = jwt.sign({ id: userData.id, username: userData.contact }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    return token;
  },
  async forgotPassword(data: { userName: string }): Promise<boolean> {
    let userData = await AuthRepository.getUserData({ userName: data?.userName });
    if (!userData) {
      throw { statusCode: 404, message: 'User not found' };
    }
    let type = AuthService.checkUserName(data?.userName);
    switch (type) {
      case 'Email':
        const resetToken = AuthService.generateResetToken();
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

        // Save reset token to database
        await AuthRepository.storeResetToken({
          userId: userData.id,
          resetToken,
          expiresAt: resetTokenExpiry,
        });

        // Email configuration
        const resetUrl = `${config.prodURL}/reset-password?token=${resetToken}`;
        sendMail({
          to: [data?.userName],
          subject: 'Password Reset Request',
          body: `
            <h2>Password Reset</h2>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `,
        });
        break;
      default:
        throw { statusCode: 400, message: 'Invalid userName. Must be a valid email.' };
    }
    return true;
  },
  async resetPassword(data: { resetToken: string; newPassword: string }): Promise<boolean> {
    const user = await AuthRepository.getUserDataBasedOnResetToken({
      resetToken: data.resetToken,
    });
    if (!user) {
      throw { statusCode: 400, message: 'Invalid or expired reset token' };
    }
    if (!user?.resetTokenExpiry || new Date() > new Date(user?.resetTokenExpiry)) {
      throw { statusCode: 400, message: 'Reset token has expired' };
    }
    const hashedPassword = await AuthService.hashPassword(data.newPassword);
    await AuthRepository.updatePassword({ userId: user.id, newPassword: hashedPassword });
    // Clear reset token and expiry
    await AuthRepository.storeResetToken({
      userId: user.id,
      resetToken: '',
      expiresAt: null,
    });
    return true;
  },
};
