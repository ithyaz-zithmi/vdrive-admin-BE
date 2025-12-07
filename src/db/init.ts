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

  // ==============================
  // DRIVERS
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    profile_pic_url TEXT,
    dob DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
    address JSONB NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_trips INTEGER DEFAULT 0,
    availability JSONB DEFAULT '{"online": false, "lastActive": null}'::jsonb,
    kyc JSONB DEFAULT '{"overallStatus": "pending", "verifiedAt": null}'::jsonb,
    credit JSONB DEFAULT '{"limit": 0, "balance": 0, "totalRecharged": 0, "totalUsed": 0, "lastRechargeAt": null}'::jsonb,
    performance JSONB DEFAULT '{"averageRating": 0, "totalTrips": 0, "cancellations": 0, "lastActive": null}'::jsonb,
    payments JSONB DEFAULT '{"totalEarnings": 0, "pendingPayout": 0, "commissionPaid": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `,

  // ==============================
  // VEHICLES
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_model VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    registration_date DATE NOT NULL,
    insurance_expiry DATE NOT NULL,
    rc_document_url TEXT,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `,

  // ==============================
  // DRIVER DOCUMENTS
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS driver_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    license_status VARCHAR(50),
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `,

  // ==============================
  // DRIVER RECHARGES
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS driver_recharges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `,

  // ==============================
  // DRIVER CREDIT USAGE
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS driver_credit_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    trip_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  `,

  // ==============================
  // DRIVER ACTIVITY LOGS
  // ==============================
  `
  CREATE TABLE IF NOT EXISTS driver_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
