import 'dotenv/config';

let db;
let sql;

if (process.env.DB_CLIENT === 'pg') {
  const { default: pg } = await import('pg');
  const { drizzle } = await import('drizzle-orm/node-postgres');
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool);
  sql = undefined;
} else {
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle: drizzleNeon } = await import('drizzle-orm/neon-http');
  const sqlClient = neon(process.env.DATABASE_URL);
  db = drizzleNeon(sqlClient);
  sql = sqlClient;
}

export { db, sql };
