import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function migrate() {
  try {
    console.log("Connecting to Turso to set up tables...");
    
    // Create the questions table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY,
        questionText TEXT NOT NULL,
        questionImage TEXT,
        options TEXT NOT NULL,
        correctOptionId TEXT NOT NULL,
        explanationText TEXT NOT NULL,
        explanationImage TEXT
      )
    `);

    // First clear existing data to run cleanly
    await client.execute(`DELETE FROM questions`);
    console.log("Cleared existing data from questions table.");

    // Load data from questions.json
    const dataPath = path.join(__dirname, "..", "src", "data", "questions.json");
    console.log(`Loading data from ${dataPath}...`);
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const questions = JSON.parse(rawData);

    console.log(`Found ${questions.length} questions. Inserting into Turso...`);

    // Insert questions row by row (in a transaction if requested, but individual executes are fine for this scale)
    const transaction = await client.transaction("write");

    for (const q of questions) {
      await transaction.execute({
        sql: `INSERT INTO questions (id, questionText, questionImage, options, correctOptionId, explanationText, explanationImage) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          q.id,
          q.questionText,
          q.questionImage || null,
          JSON.stringify(q.options), // Storing the array of objects as JSON string
          q.correctOptionId,
          q.explanationText,
          q.explanationImage || null
        ]
      });
    }

    await transaction.commit();
    console.log("Successfully inserted all questions into Turso database!");

  } catch (error) {
    console.error("Failed to migrate data to Turso:", error);
  }
}

migrate();
