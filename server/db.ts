
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.replace('.us-east-2', '-pooler.us-east-2'),
  max: 10
});

// Create Drizzle ORM client with our schema
export const db = drizzle(pool, { schema });

export { pool };
export default db;
