import "server-only";
import { connection } from "next/server";
import type { EmploymentType, JobStatus, WorkMode } from "@/content/careers";
import { EMPLOYMENT_TYPES, WORK_MODES } from "@/content/careers";
import { execute, query, type RowDataPacket } from "./db";

export interface Job {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experience: string | null;
  salary: string | null;
  summary: string;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: JobStatus;
  featured: boolean;
  /** YYYY-MM-DD or null */
  closesOn: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /** Admin lists only */
  applicationCount?: number;
}

interface JobRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: EmploymentType;
  work_mode: WorkMode;
  experience: string | null;
  salary: string | null;
  summary: string;
  description: string | null;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  status: JobStatus;
  featured: number;
  closes_on: Date | string | null;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  application_count?: number;
}

const lines = (s: string | null) =>
  (s ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const iso = (d: Date | null) => (d ? d.toISOString() : null);

/** DATE columns arrive as Date (midnight UTC) or string; the page wants "YYYY-MM-DD". */
const day = (d: Date | string | null) =>
  d == null
    ? null
    : typeof d === "string"
      ? d.slice(0, 10)
      : d.toISOString().slice(0, 10);

function toJob(r: JobRow): Job {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    department: r.department,
    location: r.location,
    employmentType: r.employment_type,
    workMode: r.work_mode,
    experience: r.experience,
    salary: r.salary,
    summary: r.summary,
    description: r.description,
    responsibilities: lines(r.responsibilities),
    requirements: lines(r.requirements),
    benefits: lines(r.benefits),
    status: r.status,
    featured: !!r.featured,
    closesOn: day(r.closes_on),
    publishedAt: iso(r.published_at),
    createdAt: r.created_at.toISOString(),
    updatedAt: r.updated_at.toISOString(),
    applicationCount: r.application_count,
  };
}

/** Open and not past its closing date. */
const OPEN =
  "status = 'open' AND (closes_on IS NULL OR closes_on >= UTC_DATE())";

/** Jobs listed on the careers page, featured first and newest first. */
export async function listOpenJobs(): Promise<Job[]> {
  await connection();
  const rows = await query<JobRow>(
    `SELECT * FROM jobs WHERE ${OPEN} ORDER BY featured DESC, published_at DESC, id DESC`,
  );
  return rows.map(toJob);
}

/** A job by its address. Drafts are hidden; closed jobs are still reachable. */
export async function getPublicJob(slug: string): Promise<Job | null> {
  await connection();
  const rows = await query<JobRow>(
    "SELECT * FROM jobs WHERE slug = ? AND status <> 'draft'",
    [slug],
  );
  return rows[0] ? toJob(rows[0]) : null;
}

/** An open job a person may apply to right now, by slug. */
export async function getApplyableJob(slug: string): Promise<Job | null> {
  const rows = await query<JobRow>(
    `SELECT * FROM jobs WHERE slug = ? AND ${OPEN}`,
    [slug],
  );
  return rows[0] ? toJob(rows[0]) : null;
}

export function isOpenNow(job: Job) {
  if (job.status !== "open") return false;
  return !job.closesOn || job.closesOn >= new Date().toISOString().slice(0, 10);
}

// ---- Admin -------------------------------------------------------------

export async function adminListJobs(): Promise<Job[]> {
  await connection();
  const rows = await query<JobRow>(
    `SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS application_count
       FROM jobs j ORDER BY FIELD(j.status,'open','draft','closed'), j.updated_at DESC`,
  );
  return rows.map(toJob);
}

export async function adminGetJob(id: number): Promise<Job | null> {
  await connection();
  const rows = await query<JobRow>(
    `SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS application_count
       FROM jobs j WHERE j.id = ?`,
    [id],
  );
  return rows[0] ? toJob(rows[0]) : null;
}

export interface JobInput {
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experience: string;
  salary: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  status: JobStatus;
  featured: boolean;
  closesOn: string;
}

export type JobErrors = Partial<Record<keyof JobInput, string>>;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

/** Reads and checks the admin's job form. Returns either clean input or the messages to show. */
export function parseJobForm(f: FormData): {
  input?: JobInput;
  errors?: JobErrors;
} {
  const s = (k: string) => String(f.get(k) ?? "").trim();
  const input: JobInput = {
    title: s("title"),
    slug: slugify(s("slug") || s("title")),
    department: s("department"),
    location: s("location"),
    employmentType: s("employmentType") as EmploymentType,
    workMode: s("workMode") as WorkMode,
    experience: s("experience"),
    salary: s("salary"),
    summary: s("summary"),
    description: s("description"),
    responsibilities: s("responsibilities"),
    requirements: s("requirements"),
    benefits: s("benefits"),
    status: s("status") as JobStatus,
    featured: f.get("featured") === "on",
    closesOn: s("closesOn"),
  };
  const errors: JobErrors = {};
  if (!input.title) errors.title = "Give the role a title.";
  else if (input.title.length > 200)
    errors.title = "Keep the title under 200 characters.";
  if (!input.slug) errors.slug = "The web address needs letters or numbers.";
  if (!input.department)
    errors.department = "Add a department, for example BIM.";
  if (!input.location)
    errors.location = "Add a location, for example Chennai, India.";
  if (!EMPLOYMENT_TYPES.some((x) => x.value === input.employmentType))
    errors.employmentType = "Choose an employment type.";
  if (!WORK_MODES.some((x) => x.value === input.workMode))
    errors.workMode = "Choose a work mode.";
  if (!input.summary)
    errors.summary = "Add a one or two line summary for the list.";
  else if (input.summary.length > 400)
    errors.summary = "Keep the summary under 400 characters.";
  if (!["draft", "open", "closed"].includes(input.status))
    errors.status = "Choose a status.";
  if (input.closesOn && !/^\d{4}-\d{2}-\d{2}$/.test(input.closesOn))
    errors.closesOn = "Use a valid date.";
  if (input.experience.length > 80)
    errors.experience = "Keep this under 80 characters.";
  if (input.salary.length > 120)
    errors.salary = "Keep this under 120 characters.";
  if (input.department.length > 80)
    errors.department = "Keep this under 80 characters.";
  if (input.location.length > 120)
    errors.location = "Keep this under 120 characters.";
  return Object.keys(errors).length ? { errors } : { input };
}

const nul = (s: string) => (s ? s : null);

/** A slug nobody else uses: adds -2, -3 … when taken. */
async function uniqueSlug(base: string, ignoreId?: number) {
  let slug = base;
  for (let n = 2; n < 200; n++) {
    const rows = await query<RowDataPacket>(
      "SELECT id FROM jobs WHERE slug = ? AND id <> ?",
      [slug, ignoreId ?? 0],
    );
    if (rows.length === 0) return slug;
    slug = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

export async function createJob(i: JobInput): Promise<number> {
  const slug = await uniqueSlug(i.slug);
  const res = await execute(
    `INSERT INTO jobs (slug, title, department, location, employment_type, work_mode, experience, salary,
       summary, description, responsibilities, requirements, benefits, status, featured, closes_on, published_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?)`,
    [
      slug,
      i.title,
      i.department,
      i.location,
      i.employmentType,
      i.workMode,
      nul(i.experience),
      nul(i.salary),
      i.summary,
      nul(i.description),
      nul(i.responsibilities),
      nul(i.requirements),
      nul(i.benefits),
      i.status,
      i.featured ? 1 : 0,
      nul(i.closesOn),
      i.status === "open" ? new Date() : null,
    ],
  );
  return res.insertId;
}

export async function updateJob(id: number, i: JobInput): Promise<void> {
  const slug = await uniqueSlug(i.slug, id);
  await execute(
    `UPDATE jobs SET slug=?, title=?, department=?, location=?, employment_type=?, work_mode=?, experience=?,
       salary=?, summary=?, description=?, responsibilities=?, requirements=?, benefits=?, status=?,
       featured=?, closes_on=?,
       published_at = CASE WHEN ? = 'open' AND published_at IS NULL THEN UTC_TIMESTAMP() ELSE published_at END
     WHERE id=?`,
    [
      slug,
      i.title,
      i.department,
      i.location,
      i.employmentType,
      i.workMode,
      nul(i.experience),
      nul(i.salary),
      i.summary,
      nul(i.description),
      nul(i.responsibilities),
      nul(i.requirements),
      nul(i.benefits),
      i.status,
      i.featured ? 1 : 0,
      nul(i.closesOn),
      i.status,
      id,
    ],
  );
}

export async function setJobStatus(
  id: number,
  status: JobStatus,
): Promise<void> {
  await execute(
    `UPDATE jobs SET status = ?,
       published_at = CASE WHEN ? = 'open' AND published_at IS NULL THEN UTC_TIMESTAMP() ELSE published_at END
     WHERE id = ?`,
    [status, status, id],
  );
}

export async function deleteJob(id: number): Promise<void> {
  await execute("DELETE FROM jobs WHERE id = ?", [id]);
}

/** A draft copy of a job, so a similar role does not start from nothing. */
export async function duplicateJob(id: number): Promise<number | null> {
  const job = await adminGetJob(id);
  if (!job) return null;
  return createJob({
    title: `${job.title} (copy)`,
    slug: slugify(`${job.title} copy`),
    department: job.department,
    location: job.location,
    employmentType: job.employmentType,
    workMode: job.workMode,
    experience: job.experience ?? "",
    salary: job.salary ?? "",
    summary: job.summary,
    description: job.description ?? "",
    responsibilities: job.responsibilities.join("\n"),
    requirements: job.requirements.join("\n"),
    benefits: job.benefits.join("\n"),
    status: "draft",
    featured: false,
    closesOn: "",
  });
}
