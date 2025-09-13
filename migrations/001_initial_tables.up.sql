-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE driver_type AS ENUM ('car', 'van', 'truck');
CREATE TYPE time_type AS ENUM ('am', 'pm');
CREATE TYPE week_day AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- ==============================
-- USERS TABLE
-- ==============================
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

-- ==============================
-- COUNTRIES
-- ==============================
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_code VARCHAR(10) NOT NULL UNIQUE,
  country_name VARCHAR(100) NOT NULL,
  country_flag TEXT,
  CONSTRAINT countries_unique UNIQUE (country_name)
);

-- ==============================
-- STATES
-- ==============================
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_code VARCHAR(20),
  state_name VARCHAR(100) NOT NULL,
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  CONSTRAINT states_unique UNIQUE (state_code, country_id),
  CONSTRAINT states_name_unique UNIQUE (state_name, country_id)
);

-- ==============================
-- CITIES
-- ==============================
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_name VARCHAR(100) NOT NULL,
  state_id UUID REFERENCES states(id) ON DELETE CASCADE, -- nullable
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  CONSTRAINT cities_unique UNIQUE (city_name, state_id, country_id)
);

-- ==============================
-- AREAS
-- ==============================
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

CREATE TABLE IF NOT EXISTS hotspots (
  id   VARCHAR(50) PRIMARY KEY,
  hotspot_name VARCHAR(150) NOT NULL,
  fare         NUMERIC(10,2) NOT NULL,
  multiplier NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS created_locations (
  location_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country       VARCHAR(100) NOT NULL,
  state         VARCHAR(100),
  district      VARCHAR(100),
  area          VARCHAR(100),         -- NULL = applies to whole district
  pincode       VARCHAR(10),          -- optional, NULL if district/state level
  global_price  NUMERIC(10,2),        -- optional global price per location
  is_hotspot    BOOLEAN DEFAULT FALSE, -- true/false hotspot flag
  hotspot_id    VARCHAR(50),           -- external hotspot reference (if any)
  UNIQUE(country, state, district, area)
);

--Rate details (1:N with created_locations)
CREATE TABLE IF NOT EXISTS rate_details (
  rate_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id     UUID NOT NULL REFERENCES created_locations(location_id) ON DELETE CASCADE,
  driver_type     driver_type NOT NULL,
  cancellation_fee NUMERIC(10,2) NOT NULL,
  waiting_per_min NUMERIC(10,2) NOT NULL,
  waiting_fee     NUMERIC(10,2) NOT NULL
);

--Timing (1:N with rate_details)
CREATE TABLE IF NOT EXISTS timings (
  timing_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_id     UUID NOT NULL REFERENCES rate_details(rate_id) ON DELETE CASCADE,
  day         week_day NOT NULL,
  from_time   INT NOT NULL,      -- hour (1–12)
  from_type   time_type NOT NULL,
  to_time     INT NOT NULL,      -- hour (1–12)
  to_type     time_type NOT NULL,
  rate        NUMERIC(10,2) NOT NULL
);
