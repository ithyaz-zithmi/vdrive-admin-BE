// src/modules/users/user.service.ts
import { AdminUserRepository } from './adminUser.repository';
import * as bcrypt from 'bcrypt';

export const AdminUserService = {
  async getAdminUsers() {
    return await AdminUserRepository.findAll();
  },

  async getAdminUserById(id: string) {
    const adminUser = await AdminUserRepository.findById(id);
    if (!adminUser) {
      throw { statusCode: 404, message: 'AdminUser not found' };
    }
    return adminUser;
  },

  async createAdminUser(data: {
    name: string;
    password: string;
    contact: string;
    alternate_contact?: string;
  }) {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await AdminUserRepository.create({
      ...data,
      password: hashedPassword,
      role: 'admin',
    });
  },

  async updateAdminUser(
    id: string,
    data: Partial<{
      name: string;
      contact: string;
      alternate_contact?: string;
    }>
  ) {
    if (data.name) {
      const existingUser = await AdminUserRepository.findById(id);
      if (!existingUser) {
        throw { statusCode: 404, message: 'AdminUser not found' };
      }
      const newName = data.name || existingUser.name;
      data.name = newName;
    }

    const adminUser = await AdminUserRepository.update(id, data);
    if (!adminUser) {
      throw { statusCode: 404, message: 'AdminUser not found' };
    }
    return adminUser;
  },

  async deleteAdminUser(id: string) {
    const deleted = await AdminUserRepository.softDelete(id);
    if (!deleted) {
      throw { statusCode: 404, message: 'AdminUser not found' };
    }
    return { message: 'AdminUser deleted successfully' };
  },
};
