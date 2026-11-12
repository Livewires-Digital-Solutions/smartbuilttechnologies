import "server-only";
import {
  createHmac,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

/**
 * One shared admin login. The username and password come from the environment
 * (ADMIN_USERNAME and ADMIN_PASSWORD, or ADMIN_PASSWORD_HASH from `npm run
 * admin:hash`). A successful login sets a signed, HTTP-only cookie that expires
 * after eight hours. Nothing about the session is stored on the server.
 */

const COOKIE = "sbt_admin";
const TTL_SECONDS = 8 * 60 * 60;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }
  return s;
}

const sign = (value: string) =>
  createHmac("sha256", secret()).update(value).digest("hex");

/** Constant-time comparison that does not leak the length. */
function same(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function adminConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
    (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD) &&
    process.env.SESSION_SECRET &&
    process.env.SESSION_SECRET.length >= 32,
  );
}

function passwordMatches(password: string): boolean {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    const [scheme, salt, digest] = hash.split("$");
    if (scheme !== "scrypt" || !salt || !digest) return false;
    const expected = Buffer.from(digest, "hex");
    const actual = scryptSync(password, salt, expected.length);
    return timingSafeEqual(actual, expected);
  }
  return same(password, process.env.ADMIN_PASSWORD ?? "");
}

export function checkCredentials(username: string, password: string): boolean {
  if (!adminConfigured()) return false;
  // evaluate both so timing does not reveal which one was wrong
  const userOk = same(username, process.env.ADMIN_USERNAME ?? "");
  const passOk = passwordMatches(password);
  return userOk && passOk;
}

export async function startSession() {
  const expires = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const value = `${expires}.${sign(String(expires))}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    sameSite: "strict",
    secure: (process.env.SITE_URL ?? "").startsWith("https://"),
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function hasSession(): Promise<boolean> {
  // Read the cookies first: that makes everything after it run at request time. Checking the
  // settings before this would let a build with no settings freeze "not set up" into the page.
  const jar = await cookies();
  if (!adminConfigured()) return false;
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return false;
  const [expires, sig] = raw.split(".");
  if (!expires || !sig) return false;
  if (!same(sig, sign(expires))) return false;
  // Partial Prefetching can render with cookies but must not read the clock: wait for the request.
  await connection();
  return Number(expires) > Math.floor(Date.now() / 1000);
}

/** Call at the top of every admin page, action and route: sends visitors to the login if not signed in. */
export async function requireAdmin() {
  if (!(await hasSession())) redirect("/sys-ops");
}
