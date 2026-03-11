import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.VITE_TURSO_DATABASE_URL;
const dbAuthToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!dbUrl || !dbAuthToken) {
  console.error("Missing VITE_TURSO_DATABASE_URL or VITE_TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

const client = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

async function main() {
  try {
    console.log("Creating access_logs table in Turso...");
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS access_logs (
        code TEXT PRIMARY KEY,
        last_used INTEGER
      )
    `);

    console.log("Successfully created access_logs table!");
  } catch (error) {
    console.error("Failed to set up access_logs:", error);
  }
}

main();
