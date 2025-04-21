import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

// Crear la conexión SQLite
const sqlite = new Database('sqlite.db');

// Crear el cliente de Drizzle ORM con nuestro esquema
export const db = drizzle(sqlite, { schema });

export default db;