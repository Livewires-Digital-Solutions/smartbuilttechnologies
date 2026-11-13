import { EventForm } from "@/components/admin/EventForm";
import { requireAdmin } from "@/lib/auth";
import { eventTypes } from "@/lib/events";

export default async function NewEventPage() {
  await requireAdmin();
  const types = await eventTypes();
  return (
    <div className="flex max-w-[1100px] flex-col gap-6">
      <div>
        <p className="font-mono text-overline font-medium text-slate-700 uppercase">
          Events
        </p>
        <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
          Add an event
        </h1>
      </div>
      <EventForm types={types} />
    </div>
  );
}
