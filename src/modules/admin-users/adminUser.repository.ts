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
    first_name: string;
    last_name: string;
    full_name: string;
    password: string;
    contact: string;
    alternate_contact?: string;
    role: 'admin';
  }): Promise<AdminUser> {
    const result = await query(
      'INSERT INTO admin_users (first_name, last_name, full_name, password, contact, alternate_contact, role, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING *',
      [
        data.first_name,
        data.last_name,
        data.full_name,
        data.password,
        data.contact,
        data.alternate_contact || null,
        data.role,
      ]
    );
    return result.rows[0];
  },

  async update(
    id: string,
    data: Partial<{
      first_name: string;
      last_name: string;
      full_name: string;
      contact: string;
      alternate_contact?: string;
    }>
  ): Promise<AdminUser | null> {
    const fields = [];
    const values = [];
    let index = 1;

    if (data.first_name !== undefined) {
      fields.push(`first_name = $${index}`);
      values.push(data.first_name);
      index++;
    }
    if (data.last_name !== undefined) {
      fields.push(`last_name = $${index}`);
      values.push(data.last_name);
      index++;
    }
    if (data.full_name !== undefined) {
      fields.push(`full_name = $${index}`);
      values.push(data.full_name);
      index++;
    }
    if (data.contact !== undefined) {
      fields.push(`contact = $${index}`);
      values.push(data.contact);
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
