import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
try {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL missing (.env.local)");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const schema = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "lib", "schema.sql"),
  "utf8",
);

const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  process.stdout.write(`→ ${stmt.split("\n")[0].slice(0, 72)}…\n`);
  await sql.query(stmt);
}

console.log("schema applied");
