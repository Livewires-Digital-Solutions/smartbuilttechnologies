import Link from "next/link";
import {
  deleteJobAction,
  duplicateJobAction,
  jobStatusAction,
} from "@/app/(admin)/sys-ops/actions";
import {
  ConfirmSubmit,
  JobStatusBadge,
  btnOutline,
  btnSignal,
} from "@/components/admin/ui";
import { employmentLabel, workModeLabel } from "@/content/careers";
import { requireAdmin } from "@/lib/auth";
import { fmtDate } from "@/lib/format";
import { adminListJobs, isOpenNow } from "@/lib/jobs";

const NOTICE: Record<string, string> = {
  created: "Job saved.",
  updated: "Changes saved.",
  deleted: "Job deleted.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;
  const jobs = await adminListJobs();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Jobs
          </p>
          <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
            Manage positions
          </h1>
        </div>
        <Link href="/sys-ops/jobs/new" className={btnSignal}>
          Post a job
        </Link>
      </div>

      {saved && NOTICE[saved] ? (
        <p
          role="status"
          className="border border-navy/25 bg-white px-4 py-3 text-[0.9375rem]"
        >
          {NOTICE[saved]}
        </p>
      ) : null}

      {jobs.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border border-navy/15 bg-white p-8">
          <p className="text-[1.25rem] font-medium tracking-[-0.02em]">
            No jobs yet.
          </p>
          <p className="max-w-[50ch] text-slate-700">
            Post your first position. A draft stays hidden until you open it, so
            you can write it at your own pace.
          </p>
          <Link href="/sys-ops/jobs/new" className={btnSignal}>
            Post a job
          </Link>
        </div>
      ) : (
        <ul className="border border-navy/15 bg-white">
          {jobs.map((j) => (
            <li
              key={j.id}
              className="grid gap-x-6 gap-y-3 border-b border-navy/10 p-4 last:border-b-0 lg:grid-cols-[1fr_auto] lg:items-center"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/sys-ops/jobs/${j.id}`}
                    className="text-[1.125rem] font-semibold underline-offset-[5px] hover:underline"
                  >
                    {j.title}
                  </Link>
                  <JobStatusBadge
                    status={j.status}
                    ended={j.status === "open" && !isOpenNow(j)}
                  />
                  {j.featured ? (
                    <span className="rounded-[3px] bg-orange px-2 py-1 font-mono text-overline font-medium text-navy uppercase">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="text-[0.9375rem] text-slate-700">
                  {j.department} · {j.location} ·{" "}
                  {employmentLabel(j.employmentType)} ·{" "}
                  {workModeLabel(j.workMode)}
                  {j.closesOn ? ` · closes ${fmtDate(j.closesOn)}` : ""}
                </p>
                <p className="text-[0.875rem]">
                  <Link
                    href={`/sys-ops/applications?job=${j.id}`}
                    className="font-semibold underline underline-offset-[5px]"
                  >
                    {j.applicationCount ?? 0} application
                    {j.applicationCount === 1 ? "" : "s"}
                  </Link>
                  <span className="text-slate-700">
                    {" "}
                    · updated {fmtDate(j.updatedAt)}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/sys-ops/jobs/${j.id}`} className={btnOutline}>
                  Edit
                </Link>
                {j.status !== "draft" ? (
                  <Link
                    href={`/careers/${j.slug}`}
                    target="_blank"
                    className={btnOutline}
                  >
                    View
                  </Link>
                ) : null}
                <form action={jobStatusAction}>
                  <input type="hidden" name="id" value={j.id} />
                  <input
                    type="hidden"
                    name="status"
                    value={j.status === "open" ? "closed" : "open"}
                  />
                  <button type="submit" className={btnOutline}>
                    {j.status === "open"
                      ? "Close"
                      : j.status === "closed"
                        ? "Reopen"
                        : "Publish"}
                  </button>
                </form>
                <form action={duplicateJobAction}>
                  <input type="hidden" name="id" value={j.id} />
                  <button type="submit" className={btnOutline}>
                    Duplicate
                  </button>
                </form>
                <form action={deleteJobAction}>
                  <input type="hidden" name="id" value={j.id} />
                  <ConfirmSubmit
                    message={`Delete "${j.title}"? Its ${j.applicationCount ?? 0} application(s) are kept, but will no longer be linked to a job.`}
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
