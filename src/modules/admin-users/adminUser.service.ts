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
    first_name: string;
    last_name: string;
    password: string;
    contact: string;
    alternate_contact?: string;
  }) {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const full_name = `${data.first_name} ${data.last_name}`;
    return await AdminUserRepository.create({
      ...data,
      full_name,
      password: hashedPassword,
      role: 'admin',
    });
  },

  async updateAdminUser(
    id: string,
    data: Partial<{
      first_name: string;
      last_name: string;
      full_name: string;
      contact: string;
      alternate_contact?: string;
    }>
  ) {
    // If first_name or last_name is being updated, recompute full_name
    if (data.first_name || data.last_name) {
      const existingUser = await AdminUserRepository.findById(id);
      if (!existingUser) {
        throw { statusCode: 404, message: 'AdminUser not found' };
      }
      const newFirstName = data.first_name || existingUser.first_name;
      const newLastName = data.last_name || existingUser.last_name;
      data.full_name = `${newFirstName} ${newLastName}`;
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
