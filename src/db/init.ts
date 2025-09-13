import { query } from '../shared/database';

const createTables = [
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,

  // ==============================
  // USERS TABLE
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    contact TEXT NOT NULL UNIQUE,
    alternate_contact VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('customer', 'admin')) NOT NULL,
    reset_token TEXT,
    reset_token_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `,

  // ==============================
  // COUNTRIES
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(10) NOT NULL UNIQUE,
    country_name VARCHAR(100) NOT NULL,
    country_flag TEXT,
    CONSTRAINT countries_unique UNIQUE (country_name)
  );
  `,

  // ==============================
  // STATES
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_code VARCHAR(20),
    state_name VARCHAR(100) NOT NULL,
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    CONSTRAINT states_unique UNIQUE (state_code, country_id),
    CONSTRAINT states_name_unique UNIQUE (state_name, country_id)
  );
  `,

  // ==============================
  // CITIES
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_name VARCHAR(100) NOT NULL,
    state_id UUID REFERENCES states(id) ON DELETE CASCADE, -- nullable
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    CONSTRAINT cities_unique UNIQUE (city_name, state_id, country_id)
  );
  `,

  // ==============================
  // AREAS
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place VARCHAR(150) NOT NULL,
    zipcode VARCHAR(20), -- NEW COLUMN for zipcode
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,   -- nullable
    state_id UUID REFERENCES states(id) ON DELETE CASCADE,  -- nullable
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,

    CONSTRAINT area_parent_check CHECK (
      city_id IS NOT NULL OR state_id IS NOT NULL OR country_id IS NOT NULL
    ),
    CONSTRAINT areas_unique UNIQUE (place, city_id, country_id, zipcode)
  );
  `,
];

async function initDb() {
  try {
    for (const sql of createTables) {
      await query(sql);
    }
    console.log('✅ All tables are ready');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    throw err;
  }
}

export default initDb;
