// src/modules/packages/package.repository.ts
import { query } from '../../shared/database';
import { Package } from './package.model';

async function paginate<T>(
  baseSql: string,
  params: any[],
  orderBy: string,
  page = 1,
  limit = 10
): Promise<{ data: T[]; total: number }> {
  const offset = (page - 1) * limit;

  // Count query
  const countSql = `SELECT COUNT(*) FROM (${baseSql}) AS subquery`;
  const countRes = await query(countSql, params);

  // Apply order, limit, offset
  baseSql += ` ORDER BY ${orderBy} DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(baseSql, params);

  return { data: result.rows, total: parseInt(countRes.rows[0].count, 10) };
}

export const PackageRepository = {
  async getPackages(page: number, limit: number) {
    return paginate<Package>(`SELECT * FROM packages WHERE 1=1`, [], 'created_at', page, limit);
  },

  async findById(id: string): Promise<Package | null> {
    const result = await query('SELECT * FROM packages WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async createPackage(data: {
    package_name: string;
    duration_minutes: number;
    distance_km: number;
    extra_distance_km: number;
    extra_minutes: number;
  }): Promise<Package> {
    const result = await query(
      `INSERT INTO packages (package_name, duration_minutes, distance_km, extra_distance_km, extra_minutes, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [
        data.package_name,
        data.duration_minutes,
        data.distance_km,
        data.extra_distance_km,
        data.extra_minutes,
      ]
    );
    return result.rows[0];
  },

  async updatePackage(
    id: string,
    data: {
      package_name?: string;
      duration_minutes?: number;
      distance_km?: number;
      extra_distance_km?: number;
      extra_minutes?: number;
    }
  ): Promise<Package> {
    const fields = [];
    const params = [id];
    let paramIndex = 2;

    if (data.package_name !== undefined) {
      fields.push(`package_name = $${paramIndex}`);
      params.push(data.package_name);
      paramIndex++;
    }
    if (data.duration_minutes !== undefined) {
      fields.push(`duration_minutes = $${paramIndex}`);
      params.push(data.duration_minutes.toString());
      paramIndex++;
    }
    if (data.distance_km !== undefined) {
      fields.push(`distance_km = $${paramIndex}`);
      params.push(data.distance_km.toString());
      paramIndex++;
    }
    if (data.extra_distance_km !== undefined) {
      fields.push(`extra_distance_km = $${paramIndex}`);
      params.push(data.extra_distance_km.toString());
      paramIndex++;
    }
    if (data.extra_minutes !== undefined) {
      fields.push(`extra_minutes = $${paramIndex}`);
      params.push(data.extra_minutes.toString());
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const result = await query(
      `UPDATE packages SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      params
    );
    return result.rows[0];
  },

  async deletePackage(id: string): Promise<void> {
    const result = await query('DELETE FROM packages WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw { statusCode: 404, message: 'Package not found' };
    }
  },
};
