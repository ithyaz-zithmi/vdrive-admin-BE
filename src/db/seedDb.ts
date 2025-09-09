import fs from 'fs';
import path from 'path';
import { query } from '../shared/database';

const loadJson = (file: string) => JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf-8'));

const seedData = async () => {
  try {
    // ==============================
    // COUNTRIES
    // ==============================
    const countries = loadJson('countries.json');
    console.log('🌍 Seeding countries...');
    for (const c of countries) {
      try {
        await query(
          `INSERT INTO countries (country_code, country_name, country_flag)
           VALUES ($1, $2, $3)
           ON CONFLICT (country_code) DO NOTHING`,
          [c.isoCode, c.name, c.flag]
        );
      } catch (err: any) {
        console.error(`❌ Country insert failed: ${c.name} (${c.isoCode}) → ${err.message}`);
      }
    }

    // ==============================
    // STATES
    // ==============================
    const states = loadJson('states.json');
    console.log('🏞️ Seeding states...');
    for (const s of states) {
      try {
        const countryRes = await query(`SELECT id FROM countries WHERE country_code = $1`, [
          s.countryCode,
        ]);
        if (!countryRes.rows.length) {
          console.warn(`⚠️ Skipping state ${s.name}, country not found: ${s.countryCode}`);
          continue;
        }

        await query(
          `INSERT INTO states (state_code, state_name, country_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (state_name, country_id) DO NOTHING`,
          [s.isoCode, s.name, countryRes.rows[0].id]
        );
      } catch (err: any) {
        console.error(
          `❌ State insert failed: ${s.name} (${s.isoCode}) in ${s.countryCode} → ${err.message}`
        );
      }
    }

    // ==============================
    // CITIES
    // ==============================
    const cities = loadJson('cities.json');
    console.log('🏙️ Seeding cities...');
    for (const c of cities) {
      try {
        const countryRes = await query(`SELECT id FROM countries WHERE country_code = $1`, [
          c.countryCode,
        ]);
        const stateRes = await query(
          `SELECT id FROM states WHERE state_code = $1 AND country_id = $2`,
          [c.stateCode, countryRes.rows[0]?.id || null]
        );
        if (!countryRes.rows.length) {
          console.warn(`⚠️ Skipping city ${c.name}, country not found: ${c.countryCode}`);
          continue;
        }

        await query(
          `INSERT INTO cities (city_name, state_id, country_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (city_name, state_id, country_id) DO NOTHING`,
          [c.name, stateRes.rows[0]?.id || null, countryRes.rows[0].id]
        );
      } catch (err: any) {
        console.error(
          `❌ City insert failed: ${c.name} (${c.stateCode}, ${c.countryCode}) → ${err.message}`
        );
      }
    }

    // ==============================
    // AREAS
    // ==============================
    const areas = loadJson('all_zipcodes.json');
    console.log('📍 Seeding areas...');
    for (const a of areas) {
      try {
        const countryRes = await query(`SELECT id FROM countries WHERE country_code = $1`, [
          a.country_code,
        ]);
        const stateRes = a.state_code
          ? await query(`SELECT id FROM states WHERE state_code = $1 AND country_id = $2`, [
              a.state_code,
              countryRes.rows[0]?.id || null,
            ])
          : { rows: [] };
        const cityRes = a.province
          ? await query(
              `SELECT id FROM cities WHERE city_name = $1 AND state__id = $2 AND country_id = $3`,
              [a.province, stateRes.rows[0]?.id || null, countryRes.rows[0]?.id || null]
            )
          : { rows: [] };

        if (!countryRes.rows.length) {
          console.warn(`⚠️ Skipping area ${a.place}, country not found: ${a.country_code}`);
          continue;
        }
        console.log(
          a.place,
          a.zipcode || '',
          cityRes.rows[0]?.id || null,
          stateRes.rows[0]?.id || null,
          countryRes.rows[0].id || null
        );
        await query(
          `INSERT INTO areas (place, zipcode, city_id, state_id, country_id)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (place, country_id, zipcode) DO NOTHING`,
          [
            a.place,
            a.zipcode || '',
            cityRes.rows[0]?.id || null,
            stateRes.rows[0]?.id || null,
            countryRes.rows[0].id || null,
          ]
        );
      } catch (err: any) {
        console.error(
          `❌ Area insert failed: ${a.place} (postal: ${a.zipcode}, ${a.state_code}, ${a.country_code}, ${a.province}) → ${err.message}`
        );
      }
    }

    console.log('✅ Seeding completed.');
  } catch (err: any) {
    console.error('🚨 Error during seeding:', err.message);
  }
};

export default seedData;
