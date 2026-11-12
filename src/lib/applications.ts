import "server-only";
import { connection } from "next/server";
import type { ApplicationStatus } from "@/content/careers";
import { APPLICATION_STATUSES } from "@/content/careers";
import { execute, query, type RowDataPacket } from "./db";

export interface Application {
  id: number;
  jobId: number | null;
  /** Job slug while the job still exists */
  jobSlug: string | null;
  position: string;
  name: string;
  email: string;
  phone: string;
  experienceYears: string | null;
  message: string | null;
  cvName: string;
  cvMime: string;
  cvSize: number;
  status: ApplicationStatus;
  notes: string | null;
  createdAt: string;
  statusChangedAt: string;
}

interface Row extends RowDataPacket {
  id: number;
  job_id: number | null;
  job_slug: string | null;
  position: string;
  name: string;
  email: string;
  phone: string;
  experience_years: string | null;
  message: string | null;
  cv_path: string;
  cv_name: string;
  cv_mime: string;
  cv_size: number;
  status: ApplicationStatus;
  notes: string | null;
  created_at: Date;
  status_changed_at: Date;
}

const SELECT = `SELECT a.*, j.slug AS job_slug FROM applications a LEFT JOIN jobs j ON j.id = a.job_id`;

const toApp = (r: Row): Application => ({
  id: r.id,
  jobId: r.job_id,
  jobSlug: r.job_slug,
  position: r.position,
  name: r.name,
  email: r.email,
  phone: r.phone,
  experienceYears: r.experience_years,
  message: r.message,
  cvName: r.cv_name,
  cvMime: r.cv_mime,
  cvSize: r.cv_size,
  status: r.status,
  notes: r.notes,
  createdAt: r.created_at.toISOString(),
  statusChangedAt: r.status_changed_at.toISOString(),
});

export interface NewApplication {
  jobId: number | null;
  position: string;
  name: string;
  email: string;
  phone: string;
  experienceYears: string | null;
  message: string | null;
  cvPath: string;
  cvName: string;
  cvMime: string;
  cvSize: number;
  ipHash: string | null;
}

export async function createApplication(a: NewApplication): Promise<number> {
  const res = await execute(
    `INSERT INTO applications (job_id, position, name, email, phone, experience_years, message,
       cv_path, cv_name, cv_mime, cv_size, consent_at, ip_hash)
     VALUES (?,?,?,?,?,?,?,?,?,?,?, UTC_TIMESTAMP(), ?)`,
    [
      a.jobId,
      a.position,
      a.name,
      a.email,
      a.phone,
      a.experienceYears,
      a.message,
      a.cvPath,
      a.cvName,
      a.cvMime,
      a.cvSize,
      a.ipHash,
    ],
  );
  return res.insertId;
}

/** True when this email already applied to this job (or to the same general position) in the last day. */
export async function recentDuplicate(
  email: string,
  jobId: number | null,
  position: string,
) {
  const rows = await query<RowDataPacket>(
    `SELECT id FROM applications
      WHERE email = ? AND created_at > (UTC_TIMESTAMP() - INTERVAL 1 DAY)
        AND ${jobId == null ? "job_id IS NULL AND position = ?" : "job_id = ?"} LIMIT 1`,
    [email, jobId == null ? position : jobId],
  );
  return rows.length > 0;
}

export interface ApplicationFilter {
  status?: ApplicationStatus | "";
  jobId?: number | "general" | "";
  q?: string;
  page?: number;
}

export const PAGE_SIZE = 25;

function where(f: ApplicationFilter) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (f.status && APPLICATION_STATUSES.some((s) => s.value === f.status)) {
    clauses.push("a.status = ?");
    params.push(f.status);
  }
  if (f.jobId === "general") clauses.push("a.job_id IS NULL");
  else if (typeof f.jobId === "number") {
    clauses.push("a.job_id = ?");
    params.push(f.jobId);
  }
  if (f.q) {
    clauses.push(
      "(a.name LIKE ? OR a.email LIKE ? OR a.phone LIKE ? OR a.position LIKE ?)",
    );
    const like = `%${f.q.replace(/[%_\\]/g, "\\$&")}%`;
    params.push(like, like, like, like);
  }
  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

export async function listApplications(f: ApplicationFilter) {
  await connection();
  const w = where(f);
  const page = Math.max(1, f.page ?? 1);
  const rows = await query<Row>(
    `${SELECT} ${w.sql} ORDER BY a.created_at DESC, a.id DESC LIMIT ? OFFSET ?`,
    [...w.params, PAGE_SIZE, (page - 1) * PAGE_SIZE],
  );
  const total = await query<RowDataPacket>(
    `SELECT COUNT(*) AS n FROM applications a ${w.sql}`,
    w.params,
  );
  return { items: rows.map(toApp), total: Number(total[0]?.n ?? 0), page };
}

/** Every matching row, for the CSV export. */
export async function exportApplications(f: ApplicationFilter) {
  const w = where(f);
  const rows = await query<Row>(
    `${SELECT} ${w.sql} ORDER BY a.created_at DESC, a.id DESC`,
    w.params,
  );
  return rows.map(toApp);
}

export async function getApplication(id: number): Promise<Application | null> {
  await connection();
  const rows = await query<Row>(`${SELECT} WHERE a.id = ?`, [id]);
  return rows[0] ? toApp(rows[0]) : null;
}

/** The stored CV file name on disk, for the download route. */
export async function getCvFile(id: number) {
  const rows = await query<Row>(`${SELECT} WHERE a.id = ?`, [id]);
  const r = rows[0];
  return r ? { path: r.cv_path, name: r.cv_name, mime: r.cv_mime } : null;
}

export async function setApplicationStatus(
  id: number,
  status: ApplicationStatus,
) {
  await execute(
    "UPDATE applications SET status = ?, status_changed_at = UTC_TIMESTAMP() WHERE id = ? AND status <> ?",
    [status, id, status],
  );
}

export async function setApplicationNotes(id: number, notes: string) {
  await execute("UPDATE applications SET notes = ? WHERE id = ?", [
    notes.trim() || null,
    id,
  ]);
}

/** Removes the row and returns the CV path so the caller can delete the file. */
export async function deleteApplication(id: number): Promise<string | null> {
  const rows = await query<Row>(`${SELECT} WHERE a.id = ?`, [id]);
  if (!rows[0]) return null;
  await execute("DELETE FROM applications WHERE id = ?", [id]);
  return rows[0].cv_path;
}

export interface Overview {
  openJobs: number;
  draftJobs: number;
  newApplications: number;
  totalApplications: number;
  last7Days: number;
  byStatus: { status: ApplicationStatus; n: number }[];
}

export async function overview(): Promise<Overview> {
  await connection();
  const [j] = await query<RowDataPacket>(
    `SELECT SUM(status='open' AND (closes_on IS NULL OR closes_on >= UTC_DATE())) AS open_jobs,
            SUM(status='draft') AS draft_jobs FROM jobs`,
  );
  const [a] = await query<RowDataPacket>(
    `SELECT COUNT(*) AS total, SUM(status='new') AS fresh,
            SUM(created_at > (UTC_TIMESTAMP() - INTERVAL 7 DAY)) AS week FROM applications`,
  );
  const by = await query<RowDataPacket>(
    "SELECT status, COUNT(*) AS n FROM applications GROUP BY status",
  );
  return {
    openJobs: Number(j?.open_jobs ?? 0),
    draftJobs: Number(j?.draft_jobs ?? 0),
    newApplications: Number(a?.fresh ?? 0),
    totalApplications: Number(a?.total ?? 0),
    last7Days: Number(a?.week ?? 0),
    byStatus: by.map((r) => ({
      status: r.status as ApplicationStatus,
      n: Number(r.n),
    })),
  };
}
