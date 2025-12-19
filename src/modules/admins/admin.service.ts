import { AdminRepository } from './admin.repository';
import { Admin } from './admin.model';
import * as bcrypt from 'bcrypt';

export const AdminService = {
  async getAllAdmins(): Promise<Admin[]> {
    return await AdminRepository.findAll();
  },

  async getAdminById(id: string): Promise<Admin | null> {
    return await AdminRepository.findById(id);
  },

  async createAdmin(data: any): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await AdminRepository.create({ ...data, password: hashedPassword });
  },

  async updateAdmin(id: string, data: any): Promise<Admin | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await AdminRepository.update(id, data);
  },

  async deleteAdmin(id: string): Promise<boolean> {
    return await AdminRepository.delete(id);
  }
};
