import "server-only";
import { connection } from "next/server";
import { execute, query, type RowDataPacket } from "./db";
import { slugify } from "./jobs";
import { deriveExcerpt, validCover, type PublishStatus } from "./posts";

export interface SiteEvent {
  id: number;
  slug: string;
  title: string;
  type: string;
  /** YYYY-MM-DD */
  startDate: string;
  endDate: string | null;
  location: string;
  summary: string | null;
  /** Markdown; an event with a body gets its own page */
  body: string | null;
  cover: string | null;
  coverAlt: string | null;
  status: PublishStatus;
  updatedAt: string;
}

interface Row extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  type: string;
  start_date: Date | string;
  end_date: Date | string | null;
  location: string;
  summary: string | null;
  body: string | null;
  cover: string | null;
  cover_alt: string | null;
  status: PublishStatus;
  updated_at: Date;
}

const day = (d: Date | string | null) =>
  d == null
    ? null
    : typeof d === "string"
      ? d.slice(0, 10)
      : d.toISOString().slice(0, 10);

const toEvent = (r: Row): SiteEvent => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  type: r.type,
  startDate: day(r.start_date)!,
  endDate: day(r.end_date),
  location: r.location,
  summary: r.summary,
  body: r.body,
  cover: r.cover,
  coverAlt: r.cover_alt,
  status: r.status,
  updatedAt: r.updated_at.toISOString(),
});

/** The last day of an event: its end date, or its start date for a one-day event. */
export const lastDay = (e: SiteEvent) => e.endDate ?? e.startDate;

// ---- Public ---------------------------------------------------------------

export async function listLiveEvents(): Promise<SiteEvent[]> {
  await connection();
  const rows = await query<Row>(
    "SELECT * FROM events WHERE status = 'published' ORDER BY start_date DESC, id DESC",
  );
  return rows.map(toEvent);
}

export async function getLiveEvent(slug: string): Promise<SiteEvent | null> {
  await connection();
  const rows = await query<Row>(
    "SELECT * FROM events WHERE slug = ? AND status = 'published'",
    [slug],
  );
  return rows[0] ? toEvent(rows[0]) : null;
}

// ---- Admin ----------------------------------------------------------------

export async function adminListEvents(q = ""): Promise<SiteEvent[]> {
  await connection();
  const like = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
  const rows = await query<Row>(
    `SELECT * FROM events ${q ? "WHERE title LIKE ? OR type LIKE ? OR location LIKE ?" : ""}
      ORDER BY start_date DESC, id DESC`,
    q ? [like, like, like] : [],
  );
  return rows.map(toEvent);
}

export async function adminGetEvent(id: number): Promise<SiteEvent | null> {
  await connection();
  const rows = await query<Row>("SELECT * FROM events WHERE id = ?", [id]);
  return rows[0] ? toEvent(rows[0]) : null;
}

export async function eventTypes(): Promise<string[]> {
  const rows = await query<RowDataPacket>(
    "SELECT DISTINCT type FROM events ORDER BY type",
  );
  return rows.map((r) => String(r.type));
}

export interface EventInput {
  title: string;
  slug: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  body: string;
  cover: string;
  coverAlt: string;
  status: PublishStatus;
}
export type EventErrors = Partial<Record<keyof EventInput, string>>;

const isDate = (v: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

export function parseEventForm(f: FormData): {
  input?: EventInput;
  errors?: EventErrors;
} {
  const s = (k: string) =>
    String(f.get(k) ?? "")
      .replace(/\r\n/g, "\n")
      .trim();
  const body = s("body");
  const input: EventInput = {
    title: s("title").replace(/\s+/g, " "),
    slug: slugify(s("slug") || s("title")),
    type: s("type").replace(/\s+/g, " "),
    startDate: s("startDate"),
    endDate: s("endDate"),
    location: s("location").replace(/\s+/g, " "),
    summary:
      s("summary").replace(/\s+/g, " ") || (body ? deriveExcerpt(body) : ""),
    body,
    cover: s("cover"),
    coverAlt: s("coverAlt"),
    status: s("status") === "published" ? "published" : "draft",
  };
  const errors: EventErrors = {};
  if (!input.title) errors.title = "Give the event a title.";
  else if (input.title.length > 200)
    errors.title = "Keep the title under 200 characters.";
  if (!input.slug) errors.slug = "The web address needs letters or numbers.";
  if (!input.type) errors.type = "Add a type, for example Exhibition.";
  else if (input.type.length > 60)
    errors.type = "Keep the type under 60 characters.";
  if (!isDate(input.startDate)) errors.startDate = "Choose the start date.";
  if (input.endDate && !isDate(input.endDate))
    errors.endDate = "Use a valid date.";
  else if (
    input.endDate &&
    isDate(input.startDate) &&
    input.endDate < input.startDate
  )
    errors.endDate = "The end date cannot be before the start date.";
  if (!input.location)
    errors.location = "Add a location, for example Riyadh, KSA.";
  else if (input.location.length > 120)
    errors.location = "Keep the location under 120 characters.";
  if (input.summary.length > 400)
    errors.summary = "Keep the summary under 400 characters.";
  if (input.body.length > 200_000) errors.body = "That is too long.";
  if (!validCover(input.cover))
    errors.cover = "Use the Upload button to add a picture.";
  if (input.coverAlt.length > 200)
    errors.coverAlt = "Keep this under 200 characters.";
  return Object.keys(errors).length ? { errors } : { input };
}

async function uniqueSlug(base: string, ignoreId = 0) {
  let slug = base;
  for (let n = 2; n < 200; n++) {
    const rows = await query<RowDataPacket>(
      "SELECT id FROM events WHERE slug = ? AND id <> ?",
      [slug, ignoreId],
    );
    if (rows.length === 0) return slug;
    slug = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

const nul = (s: string) => (s ? s : null);

export async function createEvent(i: EventInput): Promise<number> {
  const slug = await uniqueSlug(i.slug);
  const res = await execute(
    `INSERT INTO events (slug, title, type, start_date, end_date, location, summary, body, cover, cover_alt, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      slug,
      i.title,
      i.type,
      i.startDate,
      nul(i.endDate),
      i.location,
      nul(i.summary),
      nul(i.body),
      nul(i.cover),
      nul(i.coverAlt),
      i.status,
    ],
  );
  return res.insertId;
}

export async function updateEvent(id: number, i: EventInput): Promise<void> {
  const slug = await uniqueSlug(i.slug, id);
  await execute(
    `UPDATE events SET slug=?, title=?, type=?, start_date=?, end_date=?, location=?, summary=?, body=?, cover=?, cover_alt=?, status=? WHERE id=?`,
    [
      slug,
      i.title,
      i.type,
      i.startDate,
      nul(i.endDate),
      i.location,
      nul(i.summary),
      nul(i.body),
      nul(i.cover),
      nul(i.coverAlt),
      i.status,
      id,
    ],
  );
}

export async function setEventStatus(id: number, status: PublishStatus) {
  await execute("UPDATE events SET status = ? WHERE id = ?", [status, id]);
}

export async function deleteEvent(id: number) {
  await execute("DELETE FROM events WHERE id = ?", [id]);
}

export async function duplicateEvent(id: number): Promise<number | null> {
  const e = await adminGetEvent(id);
  if (!e) return null;
  return createEvent({
    title: `${e.title} (copy)`,
    slug: slugify(`${e.title} copy`),
    type: e.type,
    startDate: e.startDate,
    endDate: e.endDate ?? "",
    location: e.location,
    summary: e.summary ?? "",
    body: e.body ?? "",
    cover: e.cover ?? "",
    coverAlt: e.coverAlt ?? "",
    status: "draft",
  });
}

export async function eventCounts() {
  await connection();
  const [r] = await query<RowDataPacket>(
    "SELECT SUM(status='published') AS live, SUM(status='draft') AS drafts FROM events",
  );
  return { live: Number(r?.live ?? 0), drafts: Number(r?.drafts ?? 0) };
}
