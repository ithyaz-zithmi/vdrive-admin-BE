import initDb from './init';
import { connectDatabase } from '../shared/database';
import config from '../config';
import seedData from './seedDb';
import clearDb from './clearDb';
console.log('Environment:', config.nodeEnv);

(async () => {
  await connectDatabase();
  await initDb();
  await clearDb();
  await seedData();
  process.exit(0);
})();
