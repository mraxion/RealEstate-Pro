import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuración necesaria para usar neon con WebSockets
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Crear el pool de conexiones
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Crear el cliente de Drizzle ORM con nuestro esquema
export const db = drizzle(pool, { schema });

export default db;