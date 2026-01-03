/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // Enable UUID extension
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Create custom types (only if not exists)
  pgm.sql(`DO $$ BEGIN
    CREATE TYPE driver_type AS ENUM ('car', 'van', 'truck');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`);

  pgm.sql(`DO $$ BEGIN
    CREATE TYPE time_type AS ENUM ('am', 'pm');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`);

  pgm.sql(`DO $$ BEGIN
    CREATE TYPE week_day AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`);

  pgm.sql(`DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'driver', 'admin');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`);

  pgm.sql(`DO $$ BEGIN
    CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`);

  pgm.sql(`DO $$ BEGIN
    CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'blocked', 'deleted', 'pending_verification');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;`);

  // ==============================
  // ADMIN USERS TABLE
  // ==============================
  pgm.createTable(
    'admin_users',
    {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
      name: { type: 'varchar(255)', notNull: true },
      password: { type: 'text', notNull: true },
      contact: { type: 'text', unique: true, notNull: true },
      alternate_contact: { type: 'varchar(15)' },
      role: { type: 'varchar(20)', notNull: true, default: "'admin'", check: "role = 'admin'" },
      reset_token: { type: 'text' },
      reset_token_expiry: { type: 'timestamp with time zone' },
      created_at: {
        type: 'timestamp with time zone',
        default: pgm.func('CURRENT_TIMESTAMP'),
        notNull: true,
      },
      updated_at: {
        type: 'timestamp with time zone',
        default: pgm.func('CURRENT_TIMESTAMP'),
        notNull: true,
      },
      deleted_at: { type: 'timestamp with time zone' },
      is_deleted: { type: 'boolean', default: false },
    },
    { ifNotExists: true }
  );

  // ==============================
  // COUNTRIES TABLE
  // ==============================
  pgm.createTable(
    'countries',
    {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
      country_code: { type: 'varchar(10)', notNull: true, unique: true },
      country_name: { type: 'varchar(100)', notNull: true },
      country_flag: { type: 'text' },
    },
    { ifNotExists: true }
  );

  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'countries_unique'
        AND table_name = 'countries'
      ) THEN
        ALTER TABLE countries ADD CONSTRAINT countries_unique UNIQUE (country_name);
      END IF;
    END $$;
  `);

  // ==============================
  // STATES TABLE
  // ==============================
  pgm.createTable(
    'states',
    {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
      state_code: { type: 'varchar(20)' },
      state_name: { type: 'varchar(100)', notNull: true },
      country_id: { type: 'uuid', notNull: true, references: 'countries(id)', onDelete: 'CASCADE' },
    },
    { ifNotExists: true }
  );

  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'states_unique'
        AND table_name = 'states'
      ) THEN
        ALTER TABLE states ADD CONSTRAINT states_unique UNIQUE (state_code, country_id);
      END IF;
    END $$;
  `);

  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'states_name_unique'
        AND table_name = 'states'
      ) THEN
        ALTER TABLE states ADD CONSTRAINT states_name_unique UNIQUE (state_name, country_id);
      END IF;
    END $$;
  `);

  // ==============================
  // CITIES TABLE
  // ==============================
  pgm.createTable(
    'cities',
    {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
      city_name: { type: 'varchar(100)', notNull: true },
      state_id: { type: 'uuid', references: 'states(id)', onDelete: 'CASCADE' },
      country_id: { type: 'uuid', notNull: true, references: 'countries(id)', onDelete: 'CASCADE' },
    },
    { ifNotExists: true }
  );

  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'cities_unique'
        AND table_name = 'cities'
      ) THEN
        ALTER TABLE cities ADD CONSTRAINT cities_unique UNIQUE (city_name, state_id, country_id);
      END IF;
    END $$;
  `);

  // ==============================
  // AREAS TABLE
  // ==============================
  pgm.createTable(
    'areas',
    {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
      place: { type: 'varchar(150)', notNull: true },
      zipcode: { type: 'varchar(20)' },
      city_id: { type: 'uuid', references: 'cities(id)', onDelete: 'CASCADE' },
      state_id: { type: 'uuid', references: 'states(id)', onDelete: 'CASCADE' },
      country_id: { type: 'uuid', notNull: true, references: 'countries(id)', onDelete: 'CASCADE' },
    },
    { ifNotExists: true }
  );

  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'area_parent_check'
        AND table_name = 'areas'
      ) THEN
        ALTER TABLE areas ADD CONSTRAINT area_parent_check CHECK (city_id IS NOT NULL OR state_id IS NOT NULL OR country_id IS NOT NULL);
      END IF;
    END $$;
  `);

  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'areas_unique'
        AND table_name = 'areas'
      ) THEN
        ALTER TABLE areas ADD CONSTRAINT areas_unique UNIQUE (place, city_id, country_id, zipcode);
      END IF;
    END $$;
  `);

  // ==============================
  // HOTSPOTS TABLE
  // ==============================
  pgm.createTable(
    'hotspots',
    {
      id: { type: 'varchar(50)', primaryKey: true },
      hotspot_name: { type: 'varchar(150)', notNull: true },
      fare: { type: 'numeric(10,2)', notNull: true },
      multiplier: { type: 'numeric(10,2)', notNull: true },
    },
    { ifNotExists: true }
  );

  // ==============================
  // PACKAGES TABLE
  // ==============================
  pgm.createTable(
    'packages',
    {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
      package_name: { type: 'varchar(255)', notNull: true },
      duration_minutes: { type: 'numeric(10,2)', notNull: true },
      distance_km: { type: 'numeric(10,2)', notNull: true },
      extra_distance_km: { type: 'numeric(10,2)', notNull: true },
      extra_minutes: { type: 'numeric(10,2)', notNull: true },
      created_at: {
        type: 'timestamp with time zone',
        default: pgm.func('CURRENT_TIMESTAMP'),
        notNull: true,
      },
      updated_at: {
        type: 'timestamp with time zone',
        default: pgm.func('CURRENT_TIMESTAMP'),
        notNull: true,
      },
    },
    { ifNotExists: true }
  );

  // ==============================
  // CREATED LOCATIONS TABLE
  // ==============================
  pgm.createTable(
    'created_locations',
    {
      location_id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
      country: { type: 'varchar(100)', notNull: true },
      state: { type: 'varchar(100)' },
      district: { type: 'varchar(100)' },
      area: { type: 'varchar(100)' },
      pincode: { type: 'varchar(10)' },
      global_price: { type: 'numeric(10,2)' },
      is_hotspot: { type: 'boolean', default: false },
      hotspot_id: { type: 'varchar(50)' },
    },
    { ifNotExists: true }
  );

  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'created_locations_unique'
        AND table_name = 'created_locations'
      ) THEN
        ALTER TABLE created_locations ADD CONSTRAINT created_locations_unique UNIQUE (country, state, district, area);
      END IF;
    END $$;
  `);

  // ==============================
  // RATE DETAILS TABLE
  // ==============================
  pgm.createTable(
    'rate_details',
    {
      rate_id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
      location_id: {
        type: 'uuid',
        notNull: true,
        references: 'created_locations(location_id)',
        onDelete: 'CASCADE',
      },
      driver_type: { type: 'driver_type', notNull: true },
      cancellation_fee: { type: 'numeric(10,2)', notNull: true },
      waiting_per_min: { type: 'numeric(10,2)', notNull: true },
      waiting_fee: { type: 'numeric(10,2)', notNull: true },
    },
    { ifNotExists: true }
  );

  // ==============================
  // TIMINGS TABLE
  // ==============================
  pgm.createTable(
    'timings',
    {
      timing_id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
      rate_id: {
        type: 'uuid',
        notNull: true,
        references: 'rate_details(rate_id)',
        onDelete: 'CASCADE',
      },
      day: { type: 'week_day', notNull: true },
      from_time: { type: 'integer', notNull: true, check: 'from_time >= 1 AND from_time <= 12' },
      from_type: { type: 'time_type', notNull: true },
      to_time: { type: 'integer', notNull: true, check: 'to_time >= 1 AND to_time <= 12' },
      to_type: { type: 'time_type', notNull: true },
      rate: { type: 'numeric(10,2)', notNull: true },
    },
    { ifNotExists: true }
  );

  // ==============================
  // ADMIN ACTIVITY LOGS TABLE
  // ==============================
  pgm.createTable(
    'admin_activity_logs',
    {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
      admin_id: { type: 'uuid', references: 'admin_users(id)', onDelete: 'CASCADE' },
      action: { type: 'varchar(150)', notNull: true },
      resource_type: { type: 'varchar(50)' },
      resource_id: { type: 'uuid' },
      details: { type: 'jsonb' },
      ip_address: { type: 'inet' },
      user_agent: { type: 'text' },
      created_at: { type: 'timestamp', default: pgm.func('NOW()'), notNull: true },
    },
    { ifNotExists: true }
  );

  // ==============================
  // SYSTEM CONFIG TABLE
  // ==============================
  pgm.createTable(
    'system_config',
    {
      id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
      key: { type: 'varchar(100)', unique: true, notNull: true },
      value: { type: 'jsonb' },
      description: { type: 'text' },
      created_at: { type: 'timestamp', default: pgm.func('NOW()'), notNull: true },
      updated_at: { type: 'timestamp', default: pgm.func('NOW()'), notNull: true },
    },
    { ifNotExists: true }
  );

  // ==============================
  // DRIVER RECONCILIATION UPLOADS TABLE
  // ==============================
  pgm.createTable(
    'driver_reconciliation_uploads',
    {
      id: { type: 'serial', primaryKey: true },
      admin_id: { type: 'uuid', notNull: true, references: 'admin_users(id)' },
      filename: { type: 'varchar(255)', notNull: true },
      total_rows: { type: 'integer', notNull: true },
      processed_rows: { type: 'integer', notNull: true, default: 0 },
      status: {
        type: 'varchar(20)',
        notNull: true,
        default: "'pending'",
        check: "status IN ('pending','processing','completed','failed')",
      },
      created_at: {
        type: 'timestamp with time zone',
        default: pgm.func('CURRENT_TIMESTAMP'),
        notNull: true,
      },
      updated_at: {
        type: 'timestamp with time zone',
        default: pgm.func('CURRENT_TIMESTAMP'),
        notNull: true,
      },
    },
    { ifNotExists: true }
  );

  // ==============================
  // DRIVER RECONCILIATION ROWS TABLE
  // ==============================
  pgm.createTable(
    'driver_reconciliation_rows',
    {
      id: { type: 'serial', primaryKey: true },
      upload_id: {
        type: 'integer',
        notNull: true,
        references: 'driver_reconciliation_uploads(id)',
        onDelete: 'CASCADE',
      },
      driver_name: { type: 'varchar(255)' },
      phone: { type: 'varchar(20)' },
      mail: { type: 'varchar(255)' },
      pincode: { type: 'varchar(10)' },
      dob: { type: 'date' },
      area: { type: 'varchar(255)' },
      street: { type: 'varchar(255)' },
      district: { type: 'varchar(100)' },
      state: { type: 'varchar(100)' },
      country: { type: 'varchar(100)' },
      has_account: { type: 'boolean', default: false },
      is_onboarded: { type: 'boolean', default: false },
      match_confidence: {
        type: 'integer',
        default: 0,
        check: 'match_confidence >= 0 AND match_confidence <= 3',
      },
      error_message: { type: 'text' },
      whatsapp_sent: { type: 'boolean', default: false },
      created_at: {
        type: 'timestamp with time zone',
        default: pgm.func('CURRENT_TIMESTAMP'),
        notNull: true,
      },
    },
    { ifNotExists: true }
  );

  // ==============================
  // INDEXES
  // ==============================
  pgm.createIndex('admin_users', 'contact', { ifNotExists: true });
  pgm.createIndex('admin_users', 'is_deleted', { ifNotExists: true });
  pgm.createIndex('admin_users', 'created_at', { ifNotExists: true });

  pgm.createIndex('admin_activity_logs', 'admin_id', { ifNotExists: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Drop indexes first
  pgm.dropIndex('admin_activity_logs', 'admin_id', { ifExists: true });
  pgm.dropIndex('admin_users', 'created_at', { ifExists: true });
  pgm.dropIndex('admin_users', 'is_deleted', { ifExists: true });
  pgm.dropIndex('admin_users', 'contact', { ifExists: true });

  // Drop tables (in reverse order due to foreign keys)
  pgm.dropTable('driver_reconciliation_rows', { ifExists: true });
  pgm.dropTable('driver_reconciliation_uploads', { ifExists: true });
  pgm.dropTable('system_config', { ifExists: true });
  pgm.dropTable('admin_activity_logs', { ifExists: true });
  pgm.dropTable('timings', { ifExists: true });
  pgm.dropTable('rate_details', { ifExists: true });
  pgm.dropTable('created_locations', { ifExists: true });
  pgm.dropTable('packages', { ifExists: true });
  pgm.dropTable('hotspots', { ifExists: true });
  pgm.dropTable('areas', { ifExists: true });
  pgm.dropTable('cities', { ifExists: true });
  pgm.dropTable('states', { ifExists: true });
  pgm.dropTable('countries', { ifExists: true });
  pgm.dropTable('admin_users', { ifExists: true });

  // Drop types (in reverse order)
  pgm.dropType('user_status_enum', { ifExists: true });
  pgm.dropType('gender_enum', { ifExists: true });
  pgm.dropType('user_role', { ifExists: true });
  pgm.dropType('week_day', { ifExists: true });
  pgm.dropType('time_type', { ifExists: true });
  pgm.dropType('driver_type', { ifExists: true });

  // Drop extension
  pgm.dropExtension('uuid-ossp', { ifExists: true });
};
