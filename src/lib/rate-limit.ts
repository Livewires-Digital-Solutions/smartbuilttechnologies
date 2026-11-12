import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * A small in-memory limiter, enough for one Node process on the VPS. It slows down
 * guessing at the admin login and floods of applications; it is not a firewall.
 * Counters reset when the server restarts.
 */

const hits = new Map<string, number[]>();

/** Returns true if this key is still under `max` hits in the last `windowMs`, and records the hit. */
export function allow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  // keep the map from growing for ever
  if (hits.size > 5000) {
    for (const [k, v] of hits)
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

/** The caller's address as the reverse proxy reports it. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

/** A one-way hash of the address, so a flood can be traced without storing the address itself. */
export const hashIp = (ip: string) =>
  createHash("sha256").update(`sbt:${ip}`).digest("hex");
