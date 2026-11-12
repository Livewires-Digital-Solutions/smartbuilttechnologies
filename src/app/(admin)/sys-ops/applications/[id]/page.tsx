import Link from "next/link";
import { notFound } from "next/navigation";
import {
  applicationNotesAction,
  applicationStatusAction,
  deleteApplicationAction,
} from "@/app/(admin)/sys-ops/actions";
import { ConfirmSubmit, StatusBadge } from "@/components/admin/ui";
import {
  btnOutline,
  btnPrimary,
  btnSignal,
  inputCls,
} from "@/components/admin/styles";
import { APPLICATION_STATUSES } from "@/content/careers";
import { getApplication } from "@/lib/applications";
import { requireAdmin } from "@/lib/auth";
import { fmtDateTime, fmtSize } from "@/lib/format";

export default async function ApplicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const id = Number((await params).id);
  const app = Number.isInteger(id) && id > 0 ? await getApplication(id) : null;
  if (!app) notFound();
  const { saved } = await searchParams;

  const details: [string, React.ReactNode][] = [
    ["Position", app.position],
    [
      "Email",
      <a
        key="e"
        href={`mailto:${app.email}`}
        className="underline underline-offset-[5px]"
      >
        {app.email}
      </a>,
    ],
    [
      "Phone",
      <a
        key="p"
        href={`tel:${app.phone.replace(/\s/g, "")}`}
        className="underline underline-offset-[5px]"
      >
        {app.phone}
      </a>,
    ],
    ...(app.experienceYears
      ? ([["Experience", `${app.experienceYears} years`]] as [
          string,
          React.ReactNode,
        ][])
      : []),
    ["Applied", fmtDateTime(app.createdAt)],
    ["Status changed", fmtDateTime(app.statusChangedAt)],
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/sys-ops/applications"
        className="text-[0.9375rem] font-semibold underline underline-offset-[5px]"
      >
        ← All applications
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Application #{app.id}
          </p>
          <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
            {app.name}
          </h1>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {saved ? (
        <p
          role="status"
          className="border border-navy/25 bg-white px-4 py-3 text-[0.9375rem]"
        >
          Notes saved.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <dl className="border border-navy/15 bg-white">
            {details.map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[8rem_1fr] gap-4 border-b border-navy/10 px-4 py-3 last:border-b-0"
              >
                <dt className="pt-0.5 font-mono text-overline font-medium text-slate-700 uppercase">
                  {k}
                </dt>
                <dd className="font-medium break-words">{v}</dd>
              </div>
            ))}
            {app.jobId != null && app.jobSlug ? (
              <div className="grid grid-cols-[8rem_1fr] gap-4 px-4 py-3">
                <dt className="pt-0.5 font-mono text-overline font-medium text-slate-700 uppercase">
                  Job
                </dt>
                <dd>
                  <Link
                    href={`/sys-ops/jobs/${app.jobId}`}
                    className="font-medium underline underline-offset-[5px]"
                  >
                    View the job
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>

          {app.message ? (
            <section className="border border-navy/15 bg-white p-4">
              <h2 className="mb-2 font-mono text-overline font-medium text-slate-700 uppercase">
                Message
              </h2>
              <p className="whitespace-pre-wrap">{app.message}</p>
            </section>
          ) : null}

          <section className="flex flex-wrap items-center justify-between gap-4 border border-navy/15 bg-white p-4">
            <div className="min-w-0">
              <h2 className="font-mono text-overline font-medium text-slate-700 uppercase">
                CV
              </h2>
              <p className="truncate font-medium">{app.cvName}</p>
              <p className="text-[0.875rem] text-slate-700">
                {fmtSize(app.cvSize)}
              </p>
            </div>
            <a href={`/sys-ops/cv/${app.id}`} className={btnSignal}>
              Download CV
            </a>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <form
            action={applicationStatusAction}
            className="flex flex-col gap-3 border border-navy/15 bg-white p-4"
          >
            <input type="hidden" name="id" value={app.id} />
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-overline font-medium text-slate-700 uppercase">
                Move to
              </span>
              <select
                name="status"
                defaultValue={app.status}
                className={inputCls}
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <button type="submit" className={btnPrimary}>
                Update status
              </button>
            </div>
          </form>

          <form
            action={applicationNotesAction}
            className="flex flex-col gap-3 border border-navy/15 bg-white p-4"
          >
            <input type="hidden" name="id" value={app.id} />
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-overline font-medium text-slate-700 uppercase">
                Private notes
              </span>
              <textarea
                name="notes"
                rows={7}
                maxLength={5000}
                defaultValue={app.notes ?? ""}
                className={inputCls}
                placeholder="Interview feedback, call notes… Only the team sees this."
              />
            </label>
            <div>
              <button type="submit" className={btnOutline}>
                Save notes
              </button>
            </div>
          </form>

          <form
            action={deleteApplicationAction}
            className="border border-navy/15 bg-white p-4"
          >
            <input type="hidden" name="id" value={app.id} />
            <p className="mb-3 text-[0.875rem] text-slate-700">
              Deleting removes the application and the CV file for good.
            </p>
            <ConfirmSubmit
              message={`Delete ${app.name}'s application and CV? This cannot be undone.`}
            >
              Delete application
            </ConfirmSubmit>
          </form>
        </div>
      </div>
    </div>
  );
}
