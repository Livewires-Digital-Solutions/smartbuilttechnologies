import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { StatusBadge } from "@/components/admin/ui";
import { btnOutline, btnSignal } from "@/components/admin/styles";
import { APPLICATION_STATUSES } from "@/content/careers";
import { listApplications, overview } from "@/lib/applications";
import { adminConfigured, hasSession } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { fmtDateTime } from "@/lib/format";

/** `/sys-ops`: the sign-in when signed out, the overview when signed in. */
export default async function SysOpsPage() {
  if (!(await hasSession())) {
    return (
      <div className="mx-auto flex min-h-svh max-w-[26rem] flex-col justify-center gap-8 px-5 py-16">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Smart Built Technologies
          </p>
          <h1 className="text-[2.25rem] leading-none font-medium tracking-[-0.045em]">
            Sys Ops
          </h1>
          <p className="text-slate-700">
            Sign in to manage jobs and applications.
          </p>
        </div>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p role="alert" className="border border-orange p-4 text-[0.9375rem]">
            The admin login is not set up on this server yet. Set
            ADMIN_USERNAME, ADMIN_PASSWORD and SESSION_SECRET (see .env.example)
            and restart.
          </p>
        )}
      </div>
    );
  }

  if (!dbConfigured()) {
    return (
      <p role="alert" className="border border-orange p-4">
        The database is not configured. Set the DB_* variables (see
        .env.example), run <code>npm run db:setup</code>, and restart.
      </p>
    );
  }

  const [o, latest] = await Promise.all([
    overview(),
    listApplications({ page: 1 }),
  ]);
  const counts = Object.fromEntries(o.byStatus.map((b) => [b.status, b.n]));
  const cards = [
    {
      label: "New applications",
      value: o.newApplications,
      href: "/sys-ops/applications?status=new",
      accent: true,
    },
    { label: "Last 7 days", value: o.last7Days, href: "/sys-ops/applications" },
    {
      label: "All applications",
      value: o.totalApplications,
      href: "/sys-ops/applications",
    },
    { label: "Open positions", value: o.openJobs, href: "/sys-ops/jobs" },
    { label: "Drafts", value: o.draftJobs, href: "/sys-ops/jobs" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Overview
          </p>
          <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
            Hiring at a glance
          </h1>
        </div>
        <Link href="/sys-ops/jobs/new" className={btnSignal}>
          Post a job
        </Link>
      </div>

      <dl className="grid grid-cols-2 gap-px border border-navy/15 bg-navy/15 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="flex flex-col gap-1 bg-white p-5 hover:bg-paper"
          >
            <dd
              className={`text-[2.5rem] leading-none font-medium tracking-[-0.05em] tabular-nums ${
                c.accent && c.value > 0 ? "text-orange" : ""
              }`}
            >
              {c.value}
            </dd>
            <dt className="font-mono text-overline font-medium text-slate-700 uppercase">
              {c.label}
            </dt>
          </Link>
        ))}
      </dl>

      <section aria-labelledby="pipeline">
        <h2
          id="pipeline"
          className="mb-3 font-mono text-overline font-medium text-slate-700 uppercase"
        >
          Pipeline
        </h2>
        <ul className="flex flex-wrap gap-2">
          {APPLICATION_STATUSES.map((s) => (
            <li key={s.value}>
              <Link
                href={`/sys-ops/applications?status=${s.value}`}
                className="flex items-center gap-3 rounded-[var(--radius-button)] border border-navy/25 bg-white px-3 py-2 hover:border-navy"
              >
                <StatusBadge status={s.value} />
                <span className="font-semibold tabular-nums">
                  {counts[s.value] ?? 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="latest">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="latest"
            className="font-mono text-overline font-medium text-slate-700 uppercase"
          >
            Latest applications
          </h2>
          <Link href="/sys-ops/applications" className={btnOutline}>
            See all
          </Link>
        </div>
        {latest.items.length === 0 ? (
          <p className="border border-navy/15 bg-white p-6 text-slate-700">
            No applications yet. They will appear here as soon as someone
            applies.
          </p>
        ) : (
          <ul className="border border-navy/15 bg-white">
            {latest.items.slice(0, 6).map((a) => (
              <li
                key={a.id}
                className="border-b border-navy/10 last:border-b-0"
              >
                <Link
                  href={`/sys-ops/applications/${a.id}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-paper md:grid-cols-[1.2fr_1.2fr_auto_auto]"
                >
                  <span className="font-semibold">{a.name}</span>
                  <span className="text-slate-700 max-md:order-3 max-md:col-span-2">
                    {a.position}
                  </span>
                  <StatusBadge status={a.status} />
                  <span className="font-mono text-overline text-slate-700 uppercase max-md:order-4 max-md:col-span-2">
                    {fmtDateTime(a.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
