import { query } from '../../shared/database';
import { Hotspot } from './hotspot.model';

async function paginateAndSearch<T>(
  baseSql: string,
  params: any[],
  orderBy: string,
  searchField?: string,
  searchValue?: string,
  page = 1,
  limit = 10
): Promise<{ data: T[]; total: number }> {
  const offset = (page - 1) * limit;
  if (searchField && searchValue) {
    params.push(`%${searchValue}%`);
    baseSql += ` AND ${searchField} ILIKE $${params.length}`;
  }

  // Count query
  const countSql = `SELECT COUNT(*) FROM (${baseSql}) AS subquery`;
  const countRes = await query(countSql, params);

  // Apply order, limit, offset
  baseSql += ` ORDER BY ${orderBy} ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await query(baseSql, params);

  return { data: result.rows, total: parseInt(countRes.rows[0].count, 10) };
}

export const HotspotRepository = {
  async getHotspots(search: string, page: number, limit: number) {
    return paginateAndSearch<Hotspot>(
      `SELECT * FROM hotspots WHERE 1=1`,
      [],
      'hotspot_name',
      'hotspot_name',
      search,
      page,
      limit
    );
  },

  async getHotspotById(hotspot_id: string): Promise<Hotspot | null> {
    const result = await query('SELECT * FROM hotspots WHERE id = $1', [hotspot_id]);
    return result.rows[0] || null;
  },

  async getHotspotByName(hotspot_name: string): Promise<Hotspot | null> {
    const result = await query('SELECT * FROM hotspots WHERE hotspot_name = $1', [hotspot_name]);
    return result.rows[0] || null;
  },

  async getHotspotByIdAndName(id: string, hotspot_name: string): Promise<Hotspot | null> {
    const result = await query('SELECT * FROM hotspots WHERE id = $1 AND hotspot_name = $2', [
      id,
      hotspot_name,
    ]);
    return result.rows[0] || null;
  },

  async createHotspot(data: {
    hotspot_name: string;
    fare: number;
    multiplier: number;
  }): Promise<Hotspot> {
    const result = await query(
      'INSERT INTO hotspots (id, hotspot_name, fare, multiplier) VALUES (uuid_generate_v4(), $1, $2, $3) RETURNING *',
      [data.hotspot_name, data.fare, data.multiplier]
    );
    return result.rows[0];
  },

  async updateHotspot(
    id: string,
    data: {
      hotspot_name?: string;
      fare?: number;
      multiplier?: number;
    }
  ): Promise<Hotspot> {
    const fields = [];
    const params = [id];
    let paramIndex = 2;

    if (data.hotspot_name !== undefined) {
      fields.push(`hotspot_name = $${paramIndex}`);
      params.push(data.hotspot_name);
      paramIndex++;
    }
    if (data.fare !== undefined) {
      fields.push(`fare = $${paramIndex}`);
      params.push(data.fare.toString());
      paramIndex++;
    }
    if (data.multiplier !== undefined) {
      fields.push(`multiplier = $${paramIndex}`);
      params.push(data.multiplier.toString());
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const result = await query(
      `UPDATE hotspots SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );
    return result.rows[0];
  },

  async deleteHotspot(id: string): Promise<void> {
    const result = await query('DELETE FROM hotspots WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw { statusCode: 404, message: 'Hotspot not found' };
    }
  },
};
