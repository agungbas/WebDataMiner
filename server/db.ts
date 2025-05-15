import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon database
neonConfig.webSocketConstructor = ws;

// Check for database URL
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// For Vercel serverless environment, we need to handle connection pooling differently
let pool: Pool;

if (process.env.VERCEL) {
  // In Vercel, use a new connection for each request
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  // In other environments, reuse the connection pool
  const globalPool = global as unknown as { pool: Pool };
  if (!globalPool.pool) {
    globalPool.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  pool = globalPool.pool;
}

// Create Drizzle ORM instance
export const db = drizzle({ client: pool, schema });