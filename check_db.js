import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://spm-mcq-01-80-marks-mewho.aws-ap-northeast-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzMyMzMwNjksImlkIjoiMDE5Y2RjZWMtZDUwMS03YWFiLWIxZGItZjY3MzQwZjBjMWM4IiwicmlkIjoiOTc5MzZkMGQtMmUxZi00NGZkLTlmMjctNjgxYjAxYTliMzU4In0.1YFs1NrCLcYgkR-E4pvZq7kP1IICS5VoOb6Ze_lLAVQZgbsILwkdSXHQC3YELS_I4X_SXiBQBVVieqPsowlMBQ"
});

async function main() {
  try {
    const rs = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
    console.log("Tables:", rs.rows);
    
    for (const row of rs.rows) {
      if (row.name !== 'sqlite_sequence') {
        const tableData = await client.execute(`SELECT * FROM ${row.name} LIMIT 1;`);
        console.log(`\nTable ${row.name} sample row:`, tableData.rows[0]);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
