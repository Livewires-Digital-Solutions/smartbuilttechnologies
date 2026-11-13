import Link from "next/link";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { PublishBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { adminGetEvent, eventTypes } from "@/lib/events";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const id = Number((await params).id);
  const event = Number.isInteger(id) && id > 0 ? await adminGetEvent(id) : null;
  if (!event) notFound();
  const types = await eventTypes();

  return (
    <div className="flex max-w-[1100px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Events
          </p>
          <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
            Edit event
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <PublishBadge status={event.status} />
          {event.status === "published" && event.body?.trim() ? (
            <Link
              href={`/events/${event.slug}`}
              target="_blank"
              className="text-[0.9375rem] font-semibold underline underline-offset-[5px]"
            >
              View page
            </Link>
          ) : null}
        </div>
      </div>
      <EventForm event={event} types={types} />
    </div>
  );
}
