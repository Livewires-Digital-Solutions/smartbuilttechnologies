// Loads the starter blog posts and events (db/seed/*.json) into the database.
// Usage: npm run db:seed
// Safe to run again: an item whose web address already exists is left exactly as it is,
// so nothing you have edited in the admin area is ever overwritten.
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
const read = (f) => JSON.parse(readFileSync(resolve(process.cwd(), "db/seed", f), "utf8"));

const conn = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  charset: "utf8mb4",
  timezone: "Z",
});

let added = { posts: 0, events: 0 };
for (const p of read("posts.json")) {
  const [res] = await conn.query(
    `INSERT IGNORE INTO posts (slug, kind, title, excerpt, body, category, cover, cover_alt, status, published_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [p.slug, p.kind, p.title, p.excerpt, p.body, p.category, p.cover, p.coverAlt, p.status, `${p.publishedAt} 00:00:00`],
  );
  added.posts += res.affectedRows;
}
for (const e of read("events.json")) {
  const [res] = await conn.query(
    `INSERT IGNORE INTO events (slug, title, type, start_date, end_date, location, summary, body, cover, cover_alt, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [e.slug, e.title, e.type, e.startDate, e.endDate, e.location, e.summary, e.body, e.cover, e.coverAlt, e.status],
  );
  added.events += res.affectedRows;
}
const [[p]] = await conn.query("SELECT COUNT(*) n FROM posts");
const [[v]] = await conn.query("SELECT COUNT(*) n FROM events");
console.log(`Added ${added.posts} posts and ${added.events} events (now ${p.n} posts, ${v.n} events in total).`);
await conn.end();
