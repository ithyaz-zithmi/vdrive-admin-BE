import { query } from '../../shared/database';
import { Country, State, City, Area } from './location.model';

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
      `SELECT * FROM countries WHERE 1=1`,
      [],
      'country_name',
      'country_name',
      search,
      page,
      limit
    );
  },

  // States
  async getStates(country_id: string, search: string, page: number, limit: number) {
    return paginateAndSearch<State>(
      `SELECT * FROM states WHERE country_id = $1`,
      [country_id],
      'state_name',
      'state_name',
      search,
      page,
      limit
    );
  },

  // Cities
  async getCities(
    country_id: string,
    state_id: string | null,
    search: string,
    page: number,
    limit: number
  ) {
    const params: any[] = [country_id];
    let sql = `SELECT * FROM cities WHERE country_id = $1`;

    if (state_id) {
      params.push(state_id);
      sql += ` AND state_id = $${params.length}`;
    }

    return paginateAndSearch<City>(sql, params, 'city_name', 'city_name', search, page, limit);
  },

  // Areas
  async getAreas(
    country_id: string,
    state_id: string | null,
    city_id: string | null,
    search: string,
    page: number,
    limit: number
  ) {
    const params: any[] = [country_id];
    let sql = `SELECT * FROM areas WHERE country_id = $1`;

    if (state_id) {
      params.push(state_id);
      sql += ` AND state_id = $${params.length}`;
    }

    if (city_id) {
      params.push(city_id);
      sql += ` AND city_id = $${params.length}`;
    }

    return paginateAndSearch<Area>(sql, params, 'place', 'place', search, page, limit);
  },

  // Single lookups
  async getCountryById(country_id: string): Promise<Country | null> {
    const result = await query('SELECT * FROM countries WHERE id = $1', [country_id]);
    return result.rows[0] || null;
  },
  async getStateById(state_id: string): Promise<State | null> {
    const result = await query('SELECT * FROM states WHERE id = $1', [state_id]);
    return result.rows[0] || null;
  },
  async getCityById(city_id: string): Promise<City | null> {
    const result = await query('SELECT * FROM cities WHERE id = $1', [city_id]);
    return result.rows[0] || null;
  },
  async getAreaById(area_id: string): Promise<Area | null> {
    const result = await query('SELECT * FROM areas WHERE id = $1', [area_id]);
    return result.rows[0] || null;
  },

  // Code/name-based lookups
  async getCountryByCountryCode(country_code: string): Promise<Country | null> {
    const result = await query('SELECT * FROM countries WHERE country_code = $1', [country_code]);
    return result.rows[0] || null;
  },
  async getStateByStateCode(state_code: string, country_id: string): Promise<State | null> {
    const result = await query('SELECT * FROM states WHERE state_code = $1 AND country_id = $2', [
      state_code,
      country_id,
    ]);
    return result.rows[0] || null;
  },
  async getCityByCityName(
    city_name: string,
    state_id: string,
    country_id: string
  ): Promise<City | null> {
    const result = await query(
      'SELECT * FROM cities WHERE city_name = $1 AND state_id = $2 AND country_id = $3',
      [city_name, state_id, country_id]
    );
    return result.rows[0] || null;
  },
  async getAreaByAreaName(
    area_name: string,
    city_id: string | null,
    state_id: string | null,
    country_id: string
  ): Promise<Area | null> {
    const params: any[] = [area_name, country_id];
    let sql = 'SELECT * FROM areas WHERE place = $1 AND country_id = $2';
    if (city_id) {
      params.push(city_id);
      sql += ` AND city_id = $${params.length}`;
    }
    if (state_id) {
      params.push(state_id);
      sql += ` AND state_id = $${params.length}`;
    }
    const result = await query(sql, params);
    return result.rows[0] || null;
  },

  // Full location with LEFT JOIN to handle missing state or city
  async getFullLocation(area_id: string): Promise<any> {
    const result = await query(
      `SELECT
        a.id as area_id, a.place as area_place, a.city_id, a.state_id, a.country_id, a.zipcode,
        c.id as country_id, c.country_code, c.country_name, c.country_flag,
        s.id as state_id, s.state_code, s.state_name,
        ci.id as city_id, ci.city_name
      FROM areas a
      LEFT JOIN cities ci ON a.city_id = ci.id
      LEFT JOIN states s ON a.state_id = s.id
      LEFT JOIN countries c ON a.country_id = c.id
      WHERE a.id = $1`,
      [area_id]
    );

    if (!result.rows[0]) {
      return null;
    }

    const row = result.rows[0];
    const location: any = { area: null, city: null, state: null, country: null };

    if (row.area_id) {
      location.area = {
        id: row.area_id,
        place: row.area_place,
        city_id: row.city_id,
        state_id: row.state_id,
        country_id: row.country_id,
        zipcode: row.zipcode,
      };
    }

    if (row.city_id) {
      location.city = {
        id: row.city_id,
        city_name: row.city_name,
        state_id: row.state_id,
        country_id: row.country_id,
      };
    }

    if (row.state_id) {
      location.state = {
        id: row.state_id,
        state_code: row.state_code,
        state_name: row.state_name,
        country_id: row.country_id,
      };
    }

    if (row.country_id) {
      location.country = {
        id: row.country_id,
        country_code: row.country_code,
        country_name: row.country_name,
        country_flag: row.country_flag,
      };
    }

    return location;
  },

  // Inserts
  async createCountry(data: {
    country_code: string;
    country_name: string;
    country_flag?: string | null;
  }): Promise<Country> {
    const result = await query(
      'INSERT INTO countries (country_code, country_name, country_flag) VALUES ($1, $2, $3) RETURNING *',
      [data.country_code, data.country_name, data.country_flag || null]
    );
    return result.rows[0];
  },
  async createState(data: {
    state_code?: string | null;
    state_name: string;
    country_id: string;
  }): Promise<State> {
    const result = await query(
      'INSERT INTO states (state_code, state_name, country_id) VALUES ($1, $2, $3) RETURNING *',
      [data.state_code || null, data.state_name, data.country_id]
    );
    return result.rows[0];
  },
  async createCity(data: {
    city_name: string;
    state_id?: string | null;
    country_id: string;
  }): Promise<City> {
    const result = await query(
      'INSERT INTO cities (city_name, state_id, country_id) VALUES ($1, $2, $3) RETURNING *',
      [data.city_name, data.state_id || null, data.country_id]
    );
    return result.rows[0];
  },
  async createArea(data: {
    place: string;
    city_id?: string | null;
    state_id?: string | null;
    country_id: string;
    zipcode?: string | null;
  }): Promise<Area> {
    const result = await query(
      'INSERT INTO areas (place, city_id, state_id, country_id, zipcode) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        data.place,
        data.city_id || null,
        data.state_id || null,
        data.country_id,
        data.zipcode || null,
      ]
    );
    return result.rows[0];
  },
};
