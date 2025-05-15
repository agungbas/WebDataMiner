import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from "../shared/schema";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  console.log("Connecting to database...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });

  console.log("Pushing schema to database...");
  // Instead of migrations, we'll do a direct schema push for simplicity
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS frame_states (
        id SERIAL PRIMARY KEY,
        frame_id TEXT NOT NULL UNIQUE,
        state TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS frame_interactions (
        id SERIAL PRIMARY KEY,
        frame_id TEXT NOT NULL,
        fid INTEGER NOT NULL,
        action TEXT NOT NULL,
        amount INTEGER,
        timestamp TEXT NOT NULL
      );
    `);
    
    console.log("Schema push complete.");
  } catch (error) {
    console.error("Error pushing schema:", error);
    process.exit(1);
  }

  await pool.end();
}

main().catch(err => {
  console.error("Error in migration:", err);
  process.exit(1);
});