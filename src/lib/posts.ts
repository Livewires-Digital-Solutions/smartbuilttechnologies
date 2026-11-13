import "server-only";
import { connection } from "next/server";
import { execute, query, type RowDataPacket } from "./db";
import { slugify } from "./jobs";

export type PostKind = "news" | "article";
export type PublishStatus = "draft" | "published";

export interface Post {
  id: number;
  slug: string;
  kind: PostKind;
  title: string;
  excerpt: string;
  /** Markdown */
  body: string;
  category: string | null;
  cover: string | null;
  coverAlt: string | null;
  status: PublishStatus;
  /** ISO timestamp */
  publishedAt: string;
  updatedAt: string;
}

interface Row extends RowDataPacket {
  id: number;
  slug: string;
  kind: PostKind;
  title: string;
  excerpt: string;
  body: string;
  category: string | null;
  cover: string | null;
  cover_alt: string | null;
  status: PublishStatus;
  published_at: Date;
  updated_at: Date;
}

const toPost = (r: Row): Post => ({
  id: r.id,
  slug: r.slug,
  kind: r.kind,
  title: r.title,
  excerpt: r.excerpt,
  body: r.body,
  category: r.category,
  cover: r.cover,
  coverAlt: r.cover_alt,
  status: r.status,
  publishedAt: r.published_at.toISOString(),
  updatedAt: r.updated_at.toISOString(),
});

/** Published, and its date has arrived. A future date schedules a post. */
const LIVE = "status = 'published' AND published_at <= UTC_TIMESTAMP()";

/** Minutes to read, at 200 words a minute, never less than one. */
export const readingMinutes = (md: string) =>
  Math.max(1, Math.round(md.trim().split(/\s+/).filter(Boolean).length / 200));

// ---- Public ---------------------------------------------------------------

export async function listLivePosts(limit?: number): Promise<Post[]> {
  await connection();
  const rows = await query<Row>(
    `SELECT * FROM posts WHERE ${LIVE} ORDER BY published_at DESC, id DESC ${limit ? "LIMIT ?" : ""}`,
    limit ? [limit] : [],
  );
  return rows.map(toPost);
}

export async function getLivePost(slug: string): Promise<Post | null> {
  await connection();
  const rows = await query<Row>(
    `SELECT * FROM posts WHERE slug = ? AND ${LIVE}`,
    [slug],
  );
  return rows[0] ? toPost(rows[0]) : null;
}

/** Other live posts, same category first, then newest. */
export async function relatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const rows = await query<Row>(
    `SELECT * FROM posts WHERE ${LIVE} AND id <> ?
      ORDER BY (category IS NOT NULL AND category = ?) DESC, published_at DESC, id DESC LIMIT ?`,
    [post.id, post.category, limit],
  );
  return rows.map(toPost);
}

// ---- Admin ----------------------------------------------------------------

export async function adminListPosts(q = ""): Promise<Post[]> {
  await connection();
  const like = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
  const rows = await query<Row>(
    `SELECT * FROM posts ${q ? "WHERE title LIKE ? OR category LIKE ? OR slug LIKE ?" : ""}
      ORDER BY FIELD(status,'draft','published'), published_at DESC, id DESC`,
    q ? [like, like, like] : [],
  );
  return rows.map(toPost);
}

export async function adminGetPost(id: number): Promise<Post | null> {
  await connection();
  const rows = await query<Row>("SELECT * FROM posts WHERE id = ?", [id]);
  return rows[0] ? toPost(rows[0]) : null;
}

export interface PostInput {
  title: string;
  slug: string;
  kind: PostKind;
  category: string;
  excerpt: string;
  body: string;
  cover: string;
  coverAlt: string;
  status: PublishStatus;
  /** YYYY-MM-DD */
  publishedAt: string;
}
export type PostErrors = Partial<Record<keyof PostInput, string>>;

/** A cover is one of our own pictures: an upload (/media/…) or a file shipped with the site (/assets/…). */
export const LOCAL_IMAGE = /^\/(media|assets)\/[A-Za-z0-9_\-./]+$/;
export const validCover = (v: string) =>
  v === "" || (LOCAL_IMAGE.test(v) && !v.includes(".."));

/** The first sentence-ish piece of the body, for when no summary was written. */
export function deriveExcerpt(md: string) {
  for (const block of md.split(/\n{2,}/)) {
    // headings, quotes, lists, tables, pictures and HTML are not a summary
    if (/^\s*(#|>|\||[-*+]\s|\d+[.)]\s|!\[|<)/.test(block)) continue;
    const t = block
      .trim()
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`>#]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!t) continue;
    const m = t.match(/^(.{40,}?[.!?])(\s|$)/);
    const sentence = m?.[1] ?? t;
    const out = sentence.slice(0, 300);
    return !m && out.length < t.length ? `${out.trimEnd()}…` : out;
  }
  return "";
}

export function parsePostForm(f: FormData): {
  input?: PostInput;
  errors?: PostErrors;
} {
  const s = (k: string) =>
    String(f.get(k) ?? "")
      .replace(/\r\n/g, "\n")
      .trim();
  const body = s("body");
  const input: PostInput = {
    title: s("title").replace(/\s+/g, " "),
    slug: slugify(s("slug") || s("title")),
    kind: s("kind") === "news" ? "news" : "article",
    category: s("category").replace(/\s+/g, " "),
    excerpt: s("excerpt").replace(/\s+/g, " ") || deriveExcerpt(body),
    body,
    cover: s("cover"),
    coverAlt: s("coverAlt"),
    status: s("status") === "published" ? "published" : "draft",
    publishedAt: s("publishedAt") || new Date().toISOString().slice(0, 10),
  };
  const errors: PostErrors = {};
  if (!input.title) errors.title = "Give the post a title.";
  else if (input.title.length > 200)
    errors.title = "Keep the title under 200 characters.";
  if (!input.slug) errors.slug = "The web address needs letters or numbers.";
  if (!input.body) errors.body = "Write the post. Markdown works here.";
  else if (input.body.length > 200_000)
    errors.body = "That is too long. Please split it into two posts.";
  if (!input.excerpt) errors.excerpt = "Add a short summary for the list.";
  else if (input.excerpt.length > 400)
    errors.excerpt = "Keep the summary under 400 characters.";
  if (input.category.length > 60)
    errors.category = "Keep the category under 60 characters.";
  if (!validCover(input.cover))
    errors.cover = "Use the Upload button to add a picture.";
  if (input.coverAlt.length > 200)
    errors.coverAlt = "Keep this under 200 characters.";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(input.publishedAt) ||
    Number.isNaN(Date.parse(input.publishedAt))
  )
    errors.publishedAt = "Use a valid date.";
  return Object.keys(errors).length ? { errors } : { input };
}

async function uniqueSlug(base: string, ignoreId = 0) {
  let slug = base;
  for (let n = 2; n < 200; n++) {
    const rows = await query<RowDataPacket>(
      "SELECT id FROM posts WHERE slug = ? AND id <> ?",
      [slug, ignoreId],
    );
    if (rows.length === 0) return slug;
    slug = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

const nul = (s: string) => (s ? s : null);

export async function createPost(i: PostInput): Promise<number> {
  const slug = await uniqueSlug(i.slug);
  const res = await execute(
    `INSERT INTO posts (slug, kind, title, excerpt, body, category, cover, cover_alt, status, published_at)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      slug,
      i.kind,
      i.title,
      i.excerpt,
      i.body,
      nul(i.category),
      nul(i.cover),
      nul(i.coverAlt),
      i.status,
      `${i.publishedAt} 00:00:00`,
    ],
  );
  return res.insertId;
}

export async function updatePost(id: number, i: PostInput): Promise<void> {
  const slug = await uniqueSlug(i.slug, id);
  await execute(
    `UPDATE posts SET slug=?, kind=?, title=?, excerpt=?, body=?, category=?, cover=?, cover_alt=?, status=?, published_at=? WHERE id=?`,
    [
      slug,
      i.kind,
      i.title,
      i.excerpt,
      i.body,
      nul(i.category),
      nul(i.cover),
      nul(i.coverAlt),
      i.status,
      `${i.publishedAt} 00:00:00`,
      id,
    ],
  );
}

export async function setPostStatus(id: number, status: PublishStatus) {
  await execute("UPDATE posts SET status = ? WHERE id = ?", [status, id]);
}

export async function deletePost(id: number) {
  await execute("DELETE FROM posts WHERE id = ?", [id]);
}

export async function duplicatePost(id: number): Promise<number | null> {
  const p = await adminGetPost(id);
  if (!p) return null;
  return createPost({
    title: `${p.title} (copy)`,
    slug: slugify(`${p.title} copy`),
    kind: p.kind,
    category: p.category ?? "",
    excerpt: p.excerpt,
    body: p.body,
    cover: p.cover ?? "",
    coverAlt: p.coverAlt ?? "",
    status: "draft",
    publishedAt: new Date().toISOString().slice(0, 10),
  });
}

export async function postCounts() {
  await connection();
  const [r] = await query<RowDataPacket>(
    `SELECT SUM(${LIVE}) AS live, SUM(status='draft') AS drafts FROM posts`,
  );
  return { live: Number(r?.live ?? 0), drafts: Number(r?.drafts ?? 0) };
}

/** Categories already in use, for the editor's suggestions. */
export async function postCategories(): Promise<string[]> {
  const rows = await query<RowDataPacket>(
    "SELECT DISTINCT category FROM posts WHERE category IS NOT NULL AND category <> '' ORDER BY category",
  );
  return rows.map((r) => String(r.category));
}
