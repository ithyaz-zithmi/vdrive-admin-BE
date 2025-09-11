import { query } from '../shared/database';

const truncateTables = ['areas', 'cities', 'states', 'countries'];

async function clearDb() {
  try {
    for (const table of truncateTables) {
      await query(`TRUNCATE TABLE ${table} CASCADE;`);
    }
    console.log('✅ All tables are cleared');
  } catch (err) {
    console.error('❌ Error clearing tables:', err);
    throw err;
  }
}

export default clearDb;
