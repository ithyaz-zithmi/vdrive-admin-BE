import { query } from '../../shared/database';
import { PricingFareRule, FareSummary } from './pricingFareRules.model';

export const PricingFareRulesRepository = {
  /**
   * Get all pricing fare rules with optional filters and pagination
   */
  async getPricingFareRules(
    filters: {
      search?: string;
      city_id?: string;
      district_id?: string;
      is_hotspot?: boolean;
    },
    page: number,
    limit: number
  ): Promise<{ data: FareSummary[]; total: number }> {
    const offset = (page - 1) * limit;
    const params: any[] = [];
    let whereConditions: string[] = [];
    let paramIndex = 1;

    // Build dynamic WHERE conditions
    if (filters.city_id) {
      whereConditions.push(`p.city_id = $${paramIndex}`);
      params.push(filters.city_id);
      paramIndex++;
    }

    if (filters.district_id) {
      whereConditions.push(`p.district_id = $${paramIndex}`);
      params.push(filters.district_id);
      paramIndex++;
    }

    if (filters.is_hotspot !== undefined) {
      whereConditions.push(`p.is_hotspot = $${paramIndex}`);
      params.push(filters.is_hotspot);
      paramIndex++;
    }

    if (filters.search) {
      whereConditions.push(
        `(c.city_name ILIKE $${paramIndex} OR a.place ILIKE $${paramIndex} OR h.hotspot_name ILIKE $${paramIndex})`
      );
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count total records
    const countQuery = `
      SELECT COUNT(*) 
      FROM price_and_fare_rules p
      LEFT JOIN cities c ON p.city_id = c.id
      JOIN areas a ON p.district_id = a.id
      LEFT JOIN hotspots h ON p.hotspot_id = h.id
      ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    // Get paginated data using the view
    const dataQuery = `
      SELECT 
        p.id,
        c.city_name,
        c.id AS city_id,
        a.place AS area_name,
        a.id AS area_id,
        p.global_price,
        p.is_hotspot,
        h.id AS hotspot_id,
        h.hotspot_name,
        p.multiplier
      FROM price_and_fare_rules p
      LEFT JOIN cities c ON p.city_id = c.id
      JOIN areas a ON p.district_id = a.id
      LEFT JOIN hotspots h ON p.hotspot_id = h.id
      ${whereClause}
      ORDER BY a.place, c.city_name
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const dataResult = await query(dataQuery, params);
    return { data: dataResult.rows, total };
  },

  /**
   * Get a single pricing fare rule by ID
   */
  async getPricingFareRuleById(id: string): Promise<PricingFareRule | null> {
    const result = await query('SELECT * FROM price_and_fare_rules WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  /**
   * Get fare summary by ID (using the view logic)
   */
  async getFareSummaryById(id: string): Promise<FareSummary | null> {
    const queryText = `
      SELECT 
        p.id,
        c.city_name,
        c.id AS city_id,
        a.place AS area_name,
        a.id AS area_id,
        p.global_price,
        p.is_hotspot,
        h.id AS hotspot_id,
        h.hotspot_name,
        p.multiplier
      FROM price_and_fare_rules p
      LEFT JOIN cities c ON p.city_id = c.id
      JOIN areas a ON p.district_id = a.id
      LEFT JOIN hotspots h ON p.hotspot_id = h.id
      WHERE p.id = $1
    `;
    const result = await query(queryText, [id]);
    return result.rows[0] || null;
  },

  /**
   * Create a new pricing fare rule
   */
  async createPricingFareRule(data: {
    district_id: string;
    city_id?: string | null;
    global_price: number;
    is_hotspot: boolean;
    hotspot_id?: string | null;
    multiplier?: number | null;
  }): Promise<PricingFareRule> {
    const result = await query(
      `INSERT INTO price_and_fare_rules 
        (district_id, city_id, global_price, is_hotspot, hotspot_id, multiplier) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        data.district_id,
        data.city_id || null,
        data.global_price,
        data.is_hotspot,
        data.hotspot_id || null,
        data.multiplier || null,
      ]
    );
    return result.rows[0];
  },

  /**
   * Update a pricing fare rule
   */
  async updatePricingFareRule(
    id: string,
    data: {
      district_id?: string;
      city_id?: string | null;
      global_price?: number;
      is_hotspot?: boolean;
      hotspot_id?: string | null;
      multiplier?: number | null;
    }
  ): Promise<PricingFareRule> {
    const fields: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (data.district_id !== undefined) {
      fields.push(`district_id = $${paramIndex}`);
      params.push(data.district_id);
      paramIndex++;
    }
    if (data.city_id !== undefined) {
      fields.push(`city_id = $${paramIndex}`);
      params.push(data.city_id);
      paramIndex++;
    }
    if (data.global_price !== undefined) {
      fields.push(`global_price = $${paramIndex}`);
      params.push(data.global_price);
      paramIndex++;
    }
    if (data.is_hotspot !== undefined) {
      fields.push(`is_hotspot = $${paramIndex}`);
      params.push(data.is_hotspot);
      paramIndex++;
    }
    if (data.hotspot_id !== undefined) {
      fields.push(`hotspot_id = $${paramIndex}`);
      params.push(data.hotspot_id);
      paramIndex++;
    }
    if (data.multiplier !== undefined) {
      fields.push(`multiplier = $${paramIndex}`);
      params.push(data.multiplier);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const result = await query(
      `UPDATE price_and_fare_rules SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );
    return result.rows[0];
  },

  /**
   * Delete a pricing fare rule
   */
  async deletePricingFareRule(id: string): Promise<void> {
    const result = await query('DELETE FROM price_and_fare_rules WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw { statusCode: 404, message: 'Pricing fare rule not found' };
    }
  },

  /**
   * Check if a pricing fare rule exists for a given area/city combination
   */
  async checkDuplicateArea(
    district_id: string,
    city_id: string,
    excludeId?: string
  ): Promise<boolean> {
    const params: any[] = [district_id, city_id];
    let query_text = 'SELECT id FROM price_and_fare_rules WHERE district_id = $1 AND city_id = $2';

    if (excludeId) {
      query_text += ' AND id != $3';
      params.push(excludeId);
    }

    const result = await query(query_text, params);
    return result.rows.length > 0;
  },
};
