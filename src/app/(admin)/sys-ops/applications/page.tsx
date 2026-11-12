import Link from "next/link";
import { StatusBadge } from "@/components/admin/ui";
import { btnOutline, btnPrimary, inputCls } from "@/components/admin/styles";
import { APPLICATION_STATUSES } from "@/content/careers";
import { filterFrom } from "@/lib/application-filter";
import { PAGE_SIZE, listApplications } from "@/lib/applications";
import { requireAdmin } from "@/lib/auth";
import { fmtDateTime } from "@/lib/format";
import { adminListJobs } from "@/lib/jobs";

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const filter = filterFrom(sp);
  const [{ items, total, page }, jobs] = await Promise.all([
    listApplications(filter),
    adminListJobs(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const qs = (over: Record<string, string | number>) => {
    const p = new URLSearchParams();
    if (filter.status) p.set("status", filter.status);
    if (filter.jobId !== "" && filter.jobId !== undefined)
      p.set("job", String(filter.jobId));
    if (filter.q) p.set("q", filter.q);
    for (const [k, v] of Object.entries(over)) p.set(k, String(v));
    return p.toString();
  };
  const filtered = !!(filter.status || filter.jobId !== "" || filter.q);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Applications
          </p>
          <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
            Applicants
          </h1>
        </div>
        <a
          href={`/sys-ops/applications/export${qs({}) ? `?${qs({})}` : ""}`}
          className={btnOutline}
        >
          Export CSV{filtered ? " (filtered)" : ""}
        </a>
      </div>

      {one(sp.deleted) ? (
        <p
          role="status"
          className="border border-navy/25 bg-white px-4 py-3 text-[0.9375rem]"
        >
          Application deleted, with its CV file.
        </p>
      ) : null}

      {/* the key resets the fields when the filters in the address change */}
      <form
        key={`${filter.status}|${filter.jobId}|${filter.q}`}
        method="get"
        className="flex flex-wrap items-end gap-3 border border-navy/15 bg-white p-4"
      >
        <label className="flex min-w-[14rem] flex-1 flex-col gap-1.5">
          <span className="font-mono text-overline font-medium text-slate-700 uppercase">
            Search
          </span>
          <input
            name="q"
            defaultValue={filter.q}
            placeholder="Name, email, phone or position"
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-overline font-medium text-slate-700 uppercase">
            Status
          </span>
          <select
            name="status"
            defaultValue={filter.status}
            className={`${inputCls} min-w-[10rem]`}
          >
            <option value="">All</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-overline font-medium text-slate-700 uppercase">
            Job
          </span>
          <select
            name="job"
            defaultValue={String(filter.jobId)}
            className={`${inputCls} min-w-[12rem]`}
          >
            <option value="">All</option>
            <option value="general">General applications</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={btnPrimary}>
          Filter
        </button>
        {filtered ? (
          <Link href="/sys-ops/applications" className={btnOutline}>
            Clear
          </Link>
        ) : null}
      </form>

      <p className="text-[0.9375rem] text-slate-700" aria-live="polite">
        {total} application{total === 1 ? "" : "s"}
        {filtered ? " match" : ""}
      </p>

      {items.length === 0 ? (
        <p className="border border-navy/15 bg-white p-8 text-slate-700">
          {filtered
            ? "Nothing matches those filters."
            : "No applications yet. They will appear here as soon as someone applies."}
        </p>
      ) : (
        <div className="overflow-x-auto border border-navy/15 bg-white">
          <table className="w-full min-w-[1040px] border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-navy/15 font-mono text-overline font-medium text-slate-700 uppercase">
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3">CV</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-navy/10 last:border-b-0 hover:bg-paper"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/sys-ops/applications/${a.id}`}
                      className="font-semibold underline-offset-[5px] hover:underline"
                    >
                      {a.name}
                    </Link>
                    <div className="text-[0.875rem] text-slate-700">
                      {a.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {a.position}
                    {a.jobId == null ? (
                      <div className="font-mono text-overline text-slate-700 uppercase">
                        General
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {a.experienceYears ? (
                      `${a.experienceYears} yr${a.experienceYears === "1" ? "" : "s"}`
                    ) : (
                      <span className="text-slate-500">–</span>
                    )}
                  </td>
                  <td className="max-w-[18rem] px-4 py-3">
                    {a.message ? (
                      <Link
                        href={`/sys-ops/applications/${a.id}`}
                        title={a.message}
                        className="line-clamp-2 text-slate-700 hover:text-navy"
                      >
                        {a.message}
                      </Link>
                    ) : (
                      <span className="text-slate-500">–</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {fmtDateTime(a.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/sys-ops/cv/${a.id}`}
                      className="font-semibold underline underline-offset-[5px]"
                      aria-label={`Download ${a.name}'s CV`}
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 ? (
        <nav
          aria-label="Pages"
          className="flex items-center justify-between gap-4"
        >
          {page > 1 ? (
            <Link
              href={`/sys-ops/applications?${qs({ page: page - 1 })}`}
              className={btnOutline}
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="font-mono text-overline text-slate-700 uppercase">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              href={`/sys-ops/applications?${qs({ page: page + 1 })}`}
              className={btnOutline}
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
