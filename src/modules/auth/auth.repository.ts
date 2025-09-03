// src/modules/users/user.repository.ts
import { query } from '../../shared/database';
import { User } from '../users/user.model';

export const AuthRepository = {
  async createAdmin(data: {
    name: string;
    password: string;
    contact: string;
    alternateContact: string;
    role: string;
  }): Promise<User> {
    const result = await query(
      'INSERT INTO users (name, password, contact, "alternateContact", role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, contact, "alternateContact"',
      [data.name, data.password, data.contact, data.alternateContact, data.role]
    );
    return result.rows[0];
  },
  async getUserData(data: { userName: string }): Promise<User> {
    const result = await query('SELECT id, name, password FROM users WHERE contact = $1', [
      data.userName,
    ]);
    return result.rows[0];
  },
  async getUserDataBasedOnResetToken(data: { resetToken: string }): Promise<User> {
    const result = await query(
      'SELECT id, name, "resetToken", "resetTokenExpiry"  FROM users WHERE "resetToken" = $1',
      [data.resetToken]
    );
    return result.rows[0];
  },
  async updatePassword(data: { userId: string; newPassword: string }): Promise<void> {
    await query('UPDATE users SET password = $1 WHERE id = $2', [data.newPassword, data.userId]);
  },
  async storeResetToken(data: {
    userId: string;
    resetToken: string;
    expiresAt: Date | null;
  }): Promise<void> {
    await query('UPDATE users SET "resetToken" = $1, "resetTokenExpiry" = $2 WHERE id = $3', [
      data.resetToken,
      data.expiresAt,
      data.userId,
    ]);
  },
};
