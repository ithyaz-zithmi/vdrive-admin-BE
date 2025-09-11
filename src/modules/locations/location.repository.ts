import { query } from '../../shared/database';
import { Country, State, City, Area } from './location.model';

export const LocationRepository = {
  async getCountries(
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: Country[]; total: number }> {
    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM countries WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND country_name ILIKE $${params.length}`;
    }

    // Count
    const countRes = await query(sql.replace('*', 'COUNT(*)'), params);

    sql += ` ORDER BY country_name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return { data: result.rows, total: parseInt(countRes.rows[0].count, 10) };
  },

  async getStates(
    country_id: string,
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: State[]; total: number }> {
    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM states WHERE country_id = $1`;
    const params: any[] = [country_id];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND state_name ILIKE $${params.length}`;
    }

    const countRes = await query(sql.replace('*', 'COUNT(*)'), params);

    sql += ` ORDER BY state_name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return { data: result.rows, total: parseInt(countRes.rows[0].count, 10) };
  },

  async getCities(
    country_id: string,
    state_id: string | null,
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: City[]; total: number }> {
    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM cities WHERE country_id = $1`;
    const params: any[] = [country_id];

    if (state_id) {
      params.push(state_id);
      sql += ` AND state_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND city_name ILIKE $${params.length}`;
    }

    const countRes = await query(sql.replace('*', 'COUNT(*)'), params);

    sql += ` ORDER BY city_name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return { data: result.rows, total: parseInt(countRes.rows[0].count, 10) };
  },

  async getAreas(
    country_id: string,
    state_id: string | null,
    city_id: string | null,
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: Area[]; total: number }> {
    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM areas WHERE country_id = $1`;
    const params: any[] = [country_id];

    if (state_id) {
      params.push(state_id);
      sql += ` AND state_id = $${params.length}`;
    }

    if (city_id) {
      params.push(city_id);
      sql += ` AND city_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND place ILIKE $${params.length}`;
    }

    const countRes = await query(sql.replace('*', 'COUNT(*)'), params);

    sql += ` ORDER BY place ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return { data: result.rows, total: parseInt(countRes.rows[0].count, 10) };
  },

  async getAreaById(area_id: string): Promise<Area | null> {
    const result = await query('SELECT * FROM areas WHERE id = $1', [area_id]);
    return result.rows[0] || null;
  },

  async getCityById(city_id: string): Promise<City | null> {
    const result = await query('SELECT * FROM cities WHERE id = $1', [city_id]);
    return result.rows[0] || null;
  },

  async getStateById(state_id: string): Promise<State | null> {
    const result = await query('SELECT * FROM states WHERE id = $1', [state_id]);
    return result.rows[0] || null;
  },

  async getCountryById(country_id: string): Promise<Country | null> {
    const result = await query('SELECT * FROM countries WHERE id = $1', [country_id]);
    return result.rows[0] || null;
  },

  async getCountryByCountryId(country_id: string): Promise<Country | null> {
    const result = await query('SELECT * FROM countries WHERE country_id = $1', [country_id]);
    return result.rows[0] || null;
  },

  async createCountry(data: {
    country_id: string;
    country_name: string;
    country_flag?: string;
  }): Promise<Country> {
    const result = await query(
      'INSERT INTO countries (country_id, country_name, country_flag) VALUES ($1, $ 2, $3) RETURNING *',
      [data.country_id, data.country_name, data.country_flag || null]
    );
    return result.rows[0];
  },
};
