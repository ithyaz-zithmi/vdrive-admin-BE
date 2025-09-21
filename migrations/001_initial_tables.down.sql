-- Drop tables in reverse order due to foreign keys

DROP TABLE IF EXISTS timings;
DROP TABLE IF EXISTS rate_details;
DROP TABLE IF EXISTS created_locations;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS hotspots;
DROP TABLE IF EXISTS areas;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS users;

-- Drop custom types
DROP TYPE IF EXISTS week_day;
DROP TYPE IF EXISTS time_type;
DROP TYPE IF EXISTS driver_type;
