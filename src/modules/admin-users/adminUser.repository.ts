// src/modules/users/user.repository.ts
import { query } from '../../shared/database';
import { AdminUser } from './adminUser.model';

export const AdminUserRepository = {
  async findAll(): Promise<AdminUser[]> {
    const result = await query(
      'SELECT * FROM admin_users WHERE is_deleted = false ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async findById(id: string): Promise<AdminUser | null> {
    const result = await query('SELECT * FROM admin_users WHERE id = $1 AND is_deleted = false', [
      id,
    ]);
    return result.rows[0] || null;
  },

  async create(data: {
    name: string;
    password: string;
    email: string;
    alternate_contact?: string;
    role: 'admin';
  }): Promise<AdminUser> {
    const result = await query(
      'INSERT INTO admin_users (name, password, email, alternate_contact, role, is_deleted) VALUES ($1, $2, $3, $4, $5, false) RETURNING *',
      [data.name, data.password, data.email, data.alternate_contact || null, data.role]
    );
    return result.rows[0];
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      alternate_contact?: string;
    }>
  ): Promise<AdminUser | null> {
    const fields = [];
    const values = [];
    let index = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${index}`);
      values.push(data.name);
      index++;
    }
    if (data.email !== undefined) {
      fields.push(`email = $${index}`);
      values.push(data.email);
      index++;
    }
    if (data.alternate_contact !== undefined) {
      fields.push(`alternate_contact = $${index}`);
      values.push(data.alternate_contact);
      index++;
    }

    if (fields.length === 0) {
      return null;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE admin_users SET ${fields.join(', ')} WHERE id = $${index} AND is_deleted = false RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async softDelete(id: string): Promise<boolean> {
    const result = await query(
      'UPDATE admin_users SET is_deleted = true, deleted_at = NOW() WHERE id = $1 AND is_deleted = false',
      [id]
    );
    return (result.rowCount || 0) > 0;
  },
};
