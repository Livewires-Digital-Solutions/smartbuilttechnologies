// Applies db/schema.sql to the database named in DB_* (from .env.local, .env or the environment).
// Usage: npm run db:setup
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import mysql from "mysql2/promise";

for (const f of [".env.local", ".env"]) {
  const p = resolve(process.cwd(), f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  }
}

const { DB_HOST = "127.0.0.1", DB_PORT = "3306", DB_USER, DB_PASSWORD = "", DB_NAME } = process.env;
if (!DB_USER || !DB_NAME) {
  console.error("Set DB_USER and DB_NAME (and DB_PASSWORD) first. See .env.example.");
  process.exit(1);
}

const sql = readFileSync(resolve(process.cwd(), "db/schema.sql"), "utf8");
const conn = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true,
});
await conn.query(sql);
const [tables] = await conn.query("SHOW TABLES");
console.log(
  `Schema applied to ${DB_NAME}. Tables: ${tables.map((r) => Object.values(r)[0]).join(", ")}`,
);
await conn.end();
