import Link from "next/link";
import {
  deleteEventAction,
  duplicateEventAction,
  eventStatusAction,
} from "@/app/(admin)/sys-ops/content-actions";
import {
  btnOutline,
  btnPrimary,
  btnSignal,
  inputCls,
} from "@/components/admin/styles";
import { ConfirmSubmit, PublishBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { dateRange } from "@/lib/dates";
import { adminListEvents } from "@/lib/events";

const NOTICE: Record<string, string> = {
  created: "Event saved.",
  updated: "Changes saved.",
  deleted: "Event deleted.",
};

export default async function EventsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; q?: string }>;
}) {
  await requireAdmin();
  const { saved, q = "" } = await searchParams;
  const search = q.trim().slice(0, 100);
  const events = await adminListEvents(search);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Events
          </p>
          <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
            Exhibitions and milestones
          </h1>
        </div>
        <Link href="/sys-ops/events/new" className={btnSignal}>
          Add an event
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

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 border border-navy/15 bg-white p-4"
      >
        <label className="flex min-w-[14rem] flex-1 flex-col gap-1.5">
          <span className="font-mono text-overline font-medium text-slate-700 uppercase">
            Search
          </span>
          <input
            name="q"
            defaultValue={search}
            placeholder="Title, type or location"
            className={inputCls}
          />
        </label>
        <button type="submit" className={btnPrimary}>
          Search
        </button>
        {search ? (
          <Link href="/sys-ops/events" className={btnOutline}>
            Clear
          </Link>
        ) : null}
      </form>

      {events.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border border-navy/15 bg-white p-8">
          <p className="text-[1.25rem] font-medium tracking-[-0.02em]">
            {search ? "Nothing matches that search." : "No events yet."}
          </p>
          {!search ? (
            <Link href="/sys-ops/events/new" className={btnSignal}>
              Add an event
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="border border-navy/15 bg-white">
          {events.map((e) => {
            const upcoming = (e.endDate ?? e.startDate) >= today;
            return (
              <li
                key={e.id}
                className="grid gap-x-6 gap-y-3 border-b border-navy/10 p-4 last:border-b-0 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/sys-ops/events/${e.id}`}
                      className="text-[1.125rem] font-semibold underline-offset-[5px] hover:underline"
                    >
                      {e.title}
                    </Link>
                    <PublishBadge status={e.status} />
                    {upcoming ? (
                      <span className="rounded-[3px] bg-orange px-2 py-1 font-mono text-overline font-medium text-navy uppercase">
                        Upcoming
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[0.9375rem] text-slate-700">
                    {e.type} · {dateRange(e.startDate, e.endDate)} ·{" "}
                    {e.location}
                    {e.body?.trim() ? ` · has its own page` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/sys-ops/events/${e.id}`} className={btnOutline}>
                    Edit
                  </Link>
                  {e.status === "published" && e.body?.trim() ? (
                    <Link
                      href={`/insights/${e.slug}`}
                      target="_blank"
                      className={btnOutline}
                    >
                      View
                    </Link>
                  ) : null}
                  <form action={eventStatusAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={e.status === "published" ? "draft" : "published"}
                    />
                    <button type="submit" className={btnOutline}>
                      {e.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={duplicateEventAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <button type="submit" className={btnOutline}>
                      Duplicate
                    </button>
                  </form>
                  <form action={deleteEventAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <ConfirmSubmit
                      message={`Delete "${e.title}"? This cannot be undone.`}
                    >
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
