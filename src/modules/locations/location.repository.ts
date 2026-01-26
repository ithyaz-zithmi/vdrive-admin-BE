import { query } from '../../shared/database';
import { Country, State, District, Area } from './location.model';

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

export const LocationRepository = {
  // Countries
  async getCountries(search: string, page: number, limit: number) {
    return paginateAndSearch<Country>(
      `SELECT c.name,c.code,c.flag,c.id FROM countries c WHERE 1=1`,
      [],
      'name',
      'name',
      search,
      page,
      limit
    );
  },

  // States
  async getStates(country_id: string, search: string, page: number, limit: number) {
    return paginateAndSearch<State>(
      `SELECT 
    s.id, 
    s.name, 
    s.code, 
    c.name AS country_name, 
    au_created.name AS created_by_user, 
    au_updated.name AS updated_by_user, 
    s.created_at, 
    s.updated_at 
    FROM states s 
    LEFT JOIN countries c 
    ON s.country_id = c.id 
    LEFT JOIN admin_users au_created 
    ON s.created_by = au_created.id 
    LEFT JOIN admin_users au_updated 
    ON s.updated_by = au_updated.id 
    WHERE c.id = $1`,
      [country_id],
      's.name',
      's.name',
      search,
      page,
      limit
    );
  },

  // Districts
  async getDistricts(
    state_id: string,
    country_id: string | null,
    search: string,
    page: number,
    limit: number
  ) {
    return paginateAndSearch<District>(
      `SELECT 
      d.id, 
      d.name, 
      s.name AS state_name, 
      c.name AS country_name, 
      au_created.name AS created_by_user, 
      au_updated.name AS updated_by_user, 
      d.created_at, 
      d.updated_at 
    FROM districts d
    LEFT JOIN states s 
      ON d.state_id = s.id 
    LEFT JOIN countries c 
      ON s.country_id = c.id 
    LEFT JOIN admin_users au_created 
      ON d.created_by = au_created.id 
    LEFT JOIN admin_users au_updated 
      ON d.updated_by = au_updated.id 
    WHERE d.state_id = $1 ${country_id ? `AND c.id = '${country_id}'` : ''}`,
      [state_id],
      'd.name',
      'd.name',
      search,
      page,
      limit
    );
  },

  // Areas
  async getAreas(
    district_id: string,
    state_id: string | null,
    search: string,
    page: number,
    limit: number
  ) {
    const params: any[] = [];
    let sql = `SELECT a.id, a.name, a.pincode, d.name AS district_name, s.name AS state_name, c.name AS country_name ,au_created.name AS created_by_user, 
      au_updated.name AS updated_by_user, 
      a.created_at, 
      a.updated_at FROM areas a
    LEFT JOIN districts d ON a.district_id = d.id
    LEFT JOIN states s ON d.state_id = s.id
    LEFT JOIN countries c ON s.country_id = c.id
    LEFT JOIN admin_users au_created ON a.created_by = au_created.id
    LEFT JOIN admin_users au_updated ON a.updated_by = au_updated.id WHERE 1=1`;

    if (state_id) {
      params.push(state_id);
      sql += ` AND state_id = $${params.length}`;
    }

    if (district_id) {
      params.push(district_id);
      sql += ` AND district_id = $${params.length}`;
    }

    return paginateAndSearch<Area>(sql, params, 'a.name', 'a.name', search, page, limit);
  },

  // Single lookups

  async getCountryById(country_id: string): Promise<Country | null> {
    const result = await query(
      `SELECT 
      c.id, c.name, c.code, c.flag
     FROM countries c 
     WHERE c.id = $1`,
      [country_id]
    );
    return result.rows[0] || null;
  },

  async getStateById(state_id: string): Promise<State | null> {
    const result = await query(
      `SELECT 
      s.id, s.name, s.code,
      c.name AS country_name, 
      au_created.name AS created_by_user, 
      au_updated.name AS updated_by_user,
      s.created_at, s.updated_at
     FROM states s 
     LEFT JOIN countries c ON s.country_id = c.id 
     LEFT JOIN admin_users au_created ON s.created_by = au_created.id 
     LEFT JOIN admin_users au_updated ON s.updated_by = au_updated.id 
     WHERE s.id = $1`,
      [state_id]
    );
    return result.rows[0] || null;
  },

  async getDistrictById(district_id: string): Promise<District | null> {
    const result = await query(
      `SELECT 
      d.id, d.name,
      s.name AS state_name, 
      c.name AS country_name, 
      au_created.name AS created_by_user, 
      au_updated.name AS updated_by_user,
      d.created_at, d.updated_at
     FROM districts d
     LEFT JOIN states s ON d.state_id = s.id 
     LEFT JOIN countries c ON s.country_id = c.id 
     LEFT JOIN admin_users au_created ON d.created_by = au_created.id 
     LEFT JOIN admin_users au_updated ON d.updated_by = au_updated.id 
     WHERE d.id = $1`,
      [district_id]
    );
    return result.rows[0] || null;
  },

  async getAreaById(area_id: string): Promise<Area | null> {
    const result = await query(
      `SELECT 
      a.id, a.name,
      d.name AS district_name, 
      s.name AS state_name, 
      c.name AS country_name, 
      au_created.name AS created_by_user, 
      au_updated.name AS updated_by_user,
      a.created_at, a.updated_at 
     FROM areas a
     LEFT JOIN districts d ON a.district_id = d.id
     LEFT JOIN states s ON d.state_id = s.id
     LEFT JOIN countries c ON s.country_id = c.id
     LEFT JOIN admin_users au_created ON a.created_by = au_created.id
     LEFT JOIN admin_users au_updated ON a.updated_by = au_updated.id 
     WHERE a.id = $1`,
      [area_id]
    );
    return result.rows[0] || null;
  },

  // Code/name-based lookups
  async getCountryByCountryCode(country_code: string): Promise<Country | null> {
    const result = await query(
      `SELECT 
      c.id, c.name, c.code, c.flag 
     FROM countries c 
     WHERE c.code = $1`,
      [country_code]
    );
    return result.rows[0] || null;
  },

  async getStateByStateCode(state_code: string, country_id: string): Promise<State | null> {
    const result = await query(
      `SELECT 
      s.id, s.name, s.code,
      c.name AS country_name, 
      au_created.name AS created_by_user, 
      au_updated.name AS updated_by_user,
      s.created_at, s.updated_at
     FROM states s 
     LEFT JOIN countries c ON s.country_id = c.id 
     LEFT JOIN admin_users au_created ON s.created_by = au_created.id 
     LEFT JOIN admin_users au_updated ON s.updated_by = au_updated.id 
     WHERE s.code = $1 AND s.country_id = $2`,
      [state_code, country_id]
    );
    return result.rows[0] || null;
  },

  async getDistrictByName(
    district_name: string,
    state_id: string,
    country_id: string
  ): Promise<District | null> {
    const result = await query(
      `SELECT 
      d.id, d.name,
      s.name AS state_name, 
      c.name AS country_name, 
      au_created.name AS created_by_user, 
      au_updated.name AS updated_by_user,
      d.created_at, d.updated_at
     FROM districts d
     LEFT JOIN states s ON d.state_id = s.id 
     LEFT JOIN countries c ON s.country_id = c.id 
     LEFT JOIN admin_users au_created ON d.created_by = au_created.id 
     LEFT JOIN admin_users au_updated ON d.updated_by = au_updated.id 
     WHERE d.name = $1 AND d.state_id = $2 AND s.country_id = $3`,
      [district_name, state_id, country_id]
    );
    return result.rows[0] || null;
  },

  async getAreaByAreaName(
    area_name: string,
    district_id: string | null,
    state_id: string | null,
    country_id: string
  ): Promise<Area | null> {
    const params: any[] = [area_name];

    let sql = `
    SELECT 
      a.id, a.name,
      d.name AS district_name, 
      s.name AS state_name, 
      c.name AS country_name, 
      au_created.name AS created_by_user, 
      au_updated.name AS updated_by_user,
      a.created_at, a.updated_at 
    FROM areas a
    LEFT JOIN districts d ON a.district_id = d.id
    LEFT JOIN states s ON d.state_id = s.id
    LEFT JOIN countries c ON s.country_id = c.id
    LEFT JOIN admin_users au_created ON a.created_by = au_created.id
    LEFT JOIN admin_users au_updated ON a.updated_by = au_updated.id 
    WHERE a.name = $1`;

    if (district_id) {
      params.push(district_id);
      sql += ` AND a.district_id = $${params.length}`;
    }
    if (state_id) {
      params.push(state_id);
      sql += ` AND d.state_id = $${params.length}`;
    }

    // Adding country filter via the join
    params.push(country_id);
    sql += ` AND s.country_id = $${params.length}`;

    const result = await query(sql, params);
    return result.rows[0] || null;
  },

  // Full location with LEFT JOIN to handle missing state or city
  async getFullLocation(area_id: string): Promise<any> {
    const result = await query(
      `SELECT
        a.id as area_id, a.name as area_name, a.district_id, a.state_id, a.country_id, a.pincode,
        c.id as country_id, c.code as country_code, c.name as country_name, c.flag as country_flag,
        s.id as state_id, s.code as state_code, s.name as state_name,
        d.id as district_id, d.name as district_name
      FROM areas a
      LEFT JOIN districts d ON a.district_id = d.id
      LEFT JOIN states s ON a.state_id = s.id
      LEFT JOIN countries c ON a.country_id = c.id
      WHERE a.id = $1`,
      [area_id]
    );

    if (!result.rows[0]) {
      return null;
    }

    const row = result.rows[0];
    const location: any = { area: null, district: null, state: null, country: null };

    if (row.area_id) {
      location.area = {
        id: row.area_id,
        name: row.area_name,
        district_id: row.district_id,
        state_id: row.state_id,
        country_id: row.country_id,
        pincode: row.pincode,
      };
    }

    if (row.district_id) {
      location.district = {
        id: row.district_id,
        name: row.district_name,
        state_id: row.state_id,
        country_id: row.country_id,
      };
    }

    if (row.state_id) {
      location.state = {
        id: row.state_id,
        code: row.state_code,
        name: row.state_name,
        country_id: row.country_id,
      };
    }

    if (row.country_id) {
      location.country = {
        id: row.country_id,
        code: row.country_code,
        name: row.country_name,
        flag: row.country_flag,
      };
    }

    return location;
  },

  async getLocationByPincode(pincode: string): Promise<any> {
    const result = await query(
      `SELECT
        a.id as area_id, a.name as area_name, a.district_id, a.state_id, a.country_id, a.pincode,
        c.id as country_id, c.code as country_code, c.name as country_name, c.flag as country_flag,
        s.id as state_id, s.code as state_code, s.name as state_name,
        d.id as district_id, d.name as district_name
      FROM areas a
      LEFT JOIN districts d ON a.district_id = d.id
      LEFT JOIN states s ON a.state_id = s.id
      LEFT JOIN countries c ON a.country_id = c.id
      WHERE a.pincode = $1
      LIMIT 1`,
      [pincode]
    );

    if (!result.rows[0]) {
      return null;
    }

    const row = result.rows[0];
    const location: any = {
      area: null,
      district: null,
      state: null,
      country: null,
    };

    if (row.area_id) {
      location.area = {
        id: row.area_id,
        name: row.area_name,
        district_id: row.district_id,
        state_id: row.state_id,
        country_id: row.country_id,
        pincode: row.pincode,
      };
    }

    if (row.district_id) {
      location.district = {
        id: row.district_id,
        name: row.district_name,
        state_id: row.state_id,
        country_id: row.country_id,
      };
    }

    if (row.state_id) {
      location.state = {
        id: row.state_id,
        code: row.state_code,
        name: row.state_name,
        country_id: row.country_id,
      };
    }

    if (row.country_id) {
      location.country = {
        id: row.country_id,
        code: row.country_code,
        name: row.country_name,
        flag: row.country_flag,
      };
    }

    return location;
  },

  // Inserts
  async createCountry(data: {
    code: string;
    name: string;
    flag?: string | null;
  }): Promise<Country> {
    const result = await query(
      `INSERT INTO countries (code, name, flag) 
     VALUES ($1, $2, $3) 
     RETURNING id, name, code, flag`,
      [data.code, data.name, data.flag || null]
    );
    return result.rows[0];
  },

  async createState(
    data: {
      code?: string | null;
      name: string;
      country_id: string;
    },
    admin_id: string | null
  ): Promise<State> {
    const result = await query(
      `INSERT INTO states (code, name, country_id, created_by) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, code, country_id`,
      [data.code || null, data.name, data.country_id, admin_id]
    );
    return result.rows[0];
  },

  async createDistrict(
    data: {
      name: string;
      state_id: string;
      country_id: string;
    },
    admin_id: string | null
  ): Promise<District> {
    const result = await query(
      `INSERT INTO districts (name, state_id, country_id, created_by) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, state_id, country_id`,
      [data.name, data.state_id, data.country_id, admin_id]
    );
    return result.rows[0];
  },

  async createArea(
    data: {
      name: string;
      district_id: string;
      state_id: string;
      country_id: string;
      pincode: string;
    },
    admin_id: string | null
  ): Promise<Area> {
    const result = await query(
      `INSERT INTO areas (name, district_id, state_id, country_id, pincode, created_by) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, name, district_id, state_id, country_id, pincode`,
      [data.name, data.district_id, data.state_id, data.country_id, data.pincode, admin_id]
    );
    return result.rows[0];
  },
  // Update Country
  async updateCountry(
    id: string,
    data: { name: string; code: string; flag?: string | null }
  ): Promise<Country | null> {
    const result = await query(
      `UPDATE countries SET name = $1, code = $2, flag = $3 
     WHERE id = $4 RETURNING id, name, code, flag`,
      [data.name, data.code, data.flag || null, id]
    );
    return result.rows[0] || null;
  },

  // Update State
  async updateState(
    id: string,
    data: { name: string; code?: string | null; country_id: string },
    admin_id: string | null
  ): Promise<State | null> {
    const result = await query(
      `UPDATE states SET name = $1, code = $2, country_id = $3, updated_by = $5, updated_at = NOW() 
     WHERE id = $4 RETURNING id, name, code, country_id`,
      [data.name, data.code || null, data.country_id, id, admin_id]
    );
    return result.rows[0] || null;
  },

  // Update District
  async updateDistrict(
    id: string,
    data: { name: string; state_id: string; country_id: string },
    admin_id: string | null
  ): Promise<District | null> {
    const result = await query(
      `UPDATE districts SET name = $1, state_id = $2, country_id = $3, updated_by = $5, updated_at = NOW() 
     WHERE id = $4 RETURNING id, name, state_id, country_id`,
      [data.name, data.state_id, data.country_id, id, admin_id]
    );
    return result.rows[0] || null;
  },

  // Update Area
  async updateArea(
    id: string,
    data: {
      name: string;
      district_id: string;
      state_id: string;
      country_id: string;
      pincode: string;
    },
    admin_id: string | null
  ): Promise<Area | null> {
    const result = await query(
      `UPDATE areas SET name = $1, district_id = $2, state_id = $3, country_id = $4, pincode = $5, updated_by = $6, updated_at = NOW() 
     WHERE id = $7 RETURNING id, name, district_id, state_id, country_id, pincode`,
      [data.name, data.district_id, data.state_id, data.country_id, data.pincode, admin_id, id]
    );
    return result.rows[0] || null;
  },
  // Delete Country
  async deleteCountry(id: string): Promise<boolean> {
    const result = await query('DELETE FROM countries WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  // Delete State
  async deleteState(id: string): Promise<boolean> {
    const result = await query('DELETE FROM states WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  // Delete District
  async deleteDistrict(id: string): Promise<boolean> {
    const result = await query('DELETE FROM districts WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  // Delete Area
  async deleteArea(id: string): Promise<boolean> {
    const result = await query('DELETE FROM areas WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
