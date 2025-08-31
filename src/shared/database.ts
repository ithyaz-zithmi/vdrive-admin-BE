import { Pool } from 'pg';
import { Request, Response, NextFunction } from 'express';
require('dotenv').config()
// Extend Request type to include `pool`
declare global {
  namespace Express {
    interface Request {
      pool: Pool;
    }
  }
}

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING
});

// Test connection at startup (fail fast)
pool.connect()
  .then(client => {
    return client
      .query('SELECT NOW()')
      .then(res => {
        console.log('✅ PostgreSQL connected at:', res.rows[0].now);
      })
      .catch(err => {
        console.error('❌ PostgreSQL test query failed:', err);
        process.exit(1); // stop app if DB is unreachable
      })
      .finally(() => client.release());
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err);
    process.exit(1);
  });

// Middleware: attach pool to request
export const databaseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!pool) {
    console.error('❌ Database pool is not initialized');
    return res.status(500).json({ error: 'Database not available' });
  }

  req.pool = pool;
  next();
};

// Helper to run queries with logging
export const query = async (text: string, params?: any[]) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('❌ Database query error:', { text, params, err });
    throw err;
  }
};
