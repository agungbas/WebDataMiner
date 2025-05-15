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

// Handle both Vercel and other environments with a single connection pool strategy
// In Vercel's serverless environment, each function instance gets its own pool
// So we don't need separate handling
const options = {
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum number of clients
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
};

// Create a new pool with optimized settings
pool = new Pool(options);

// Create Drizzle ORM instance
export const db = drizzle({ client: pool, schema });