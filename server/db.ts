
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

// Create SQLite database connection
const sqlite = new Database('sqlite.db');

// Create Drizzle ORM client with our schema
export const db = drizzle(sqlite, { schema });

export default db;
