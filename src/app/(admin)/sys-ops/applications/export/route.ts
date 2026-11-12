import { exportApplications } from "@/lib/applications";
import { hasSession } from "@/lib/auth";
import { statusLabel } from "@/content/careers";
import { filterFrom } from "@/lib/application-filter";

/** A CSV of the applications matching the list's current filters, for a signed-in admin. */
const cell = (v: string | number | null) => {
  let s = v == null ? "" : String(v);
  // stop a spreadsheet treating text that starts with = + - @ as a formula
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  if (!(await hasSession()))
    return new Response("Not signed in", { status: 401 });
  const url = new URL(request.url);
  const filter = filterFrom(Object.fromEntries(url.searchParams));
  const rows = await exportApplications(filter);
  const head = [
    "ID",
    "Applied (UTC)",
    "Name",
    "Email",
    "Phone",
    "Position",
    "Experience (years)",
    "Status",
    "Message",
    "Notes",
  ];
  const lines = [
    head.map(cell).join(","),
    ...rows.map((a) =>
      [
        a.id,
        a.createdAt,
        a.name,
        a.email,
        a.phone,
        a.position,
        a.experienceYears,
        statusLabel(a.status),
        a.message,
        a.notes,
      ]
        .map(cell)
        .join(","),
    ),
  ];
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
