import "server-only";
import mysql, {
  type Pool,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";

/**
 * One MySQL / MariaDB connection pool for the whole server process. Configuration
 * comes from DB_* environment variables (see .env.example). All times are UTC.
 */

const globalForDb = globalThis as unknown as { __sbtPool?: Pool };

export function dbConfigured() {
  return Boolean(process.env.DB_USER && process.env.DB_NAME);
}

function pool(): Pool {
  if (!globalForDb.__sbtPool) {
    if (!dbConfigured()) {
      throw new Error(
        "Database is not configured: set DB_USER, DB_PASSWORD and DB_NAME.",
      );
    }
    const p = mysql.createPool({
      host: process.env.DB_HOST ?? "127.0.0.1",
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME,
      charset: "utf8mb4",
      timezone: "Z",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 8000,
    } as mysql.PoolOptions);
    // Every connection speaks UTC, so NOW() and CURRENT_TIMESTAMP agree with the app.
    p.on("connection", (c) => {
      c.query("SET time_zone = '+00:00'");
    });
    globalForDb.__sbtPool = p;
  }
  return globalForDb.__sbtPool;
}

export async function query<T extends RowDataPacket>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const [rows] = await pool().query<T[]>(sql, params);
  return rows;
}

export async function execute(
  sql: string,
  params: unknown[] = [],
): Promise<ResultSetHeader> {
  const [res] = await pool().query<ResultSetHeader>(sql, params);
  return res;
}

export type { RowDataPacket };
