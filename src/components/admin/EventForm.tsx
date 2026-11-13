"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveEventAction,
  type ContentFormState,
} from "@/app/(admin)/sys-ops/content-actions";
import type { EventErrors, SiteEvent } from "@/lib/events";
import { CoverField } from "./CoverField";
import { Field } from "./fields";
import { MarkdownEditor } from "./MarkdownEditor";
import { btnOutline, inputCls } from "./styles";
import { SubmitButton } from "./ui";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

const DEFAULT_TYPES = [
  "Exhibition",
  "Conference",
  "Technology showcase",
  "Company milestone",
];

/** Create or edit an event. Keeps everything typed when there is an error. */
export function EventForm({
  event,
  types,
}: {
  event?: SiteEvent;
  types: string[];
}) {
  const [state, action] = useActionState<
    ContentFormState<EventErrors>,
    FormData
  >(saveEventAction, {});
  const v = (k: string, fallback: string) => state.values?.[k] ?? fallback;
  const e = state.errors ?? {};
  const [slugTouched, setSlugTouched] = useState(!!event);
  const [title, setTitle] = useState(v("title", event?.title ?? ""));
  const [slug, setSlug] = useState(v("slug", event?.slug ?? ""));
  const allTypes = [...new Set([...DEFAULT_TYPES, ...types])];

  return (
    <form
      action={action}
      className="flex flex-col gap-8"
      aria-label={event ? "Edit event" : "New event"}
    >
      {event ? <input type="hidden" name="id" value={event.id} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" error={e.title}>
          <input
            name="title"
            required
            maxLength={200}
            value={title}
            onChange={(ev) => {
              setTitle(ev.target.value);
              if (!slugTouched) setSlug(slugify(ev.target.value));
            }}
            className={inputCls}
            aria-invalid={!!e.title}
          />
        </Field>
        <Field
          label="Web address"
          error={e.slug}
          hint="Only used if you write about the event below, which gives it its own page."
        >
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[0.875rem] text-slate-700">
              /events/
            </span>
            <input
              name="slug"
              maxLength={160}
              value={slug}
              onChange={(ev) => {
                setSlugTouched(true);
                setSlug(slugify(ev.target.value));
              }}
              className={inputCls}
              aria-invalid={!!e.slug}
            />
          </div>
        </Field>
        <Field label="Type" error={e.type}>
          <>
            <input
              name="type"
              required
              maxLength={60}
              list="event-types"
              defaultValue={v("type", event?.type ?? "Exhibition")}
              className={inputCls}
              aria-invalid={!!e.type}
            />
            <datalist id="event-types">
              {allTypes.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </>
        </Field>
        <Field label="Location" error={e.location}>
          <input
            name="location"
            required
            maxLength={120}
            defaultValue={v("location", event?.location ?? "")}
            className={inputCls}
            placeholder="Riyadh, KSA"
            aria-invalid={!!e.location}
          />
        </Field>
        <Field label="Starts" error={e.startDate}>
          <input
            name="startDate"
            type="date"
            required
            defaultValue={v("startDate", event?.startDate ?? "")}
            className={inputCls}
            aria-invalid={!!e.startDate}
          />
        </Field>
        <Field
          label="Ends (optional)"
          error={e.endDate}
          hint="For events over several days."
        >
          <input
            name="endDate"
            type="date"
            defaultValue={v("endDate", event?.endDate ?? "")}
            className={inputCls}
            aria-invalid={!!e.endDate}
          />
        </Field>
      </div>

      <Field
        label="Summary (optional)"
        error={e.summary}
        hint="One or two lines shown on the event's card."
      >
        <textarea
          name="summary"
          rows={2}
          maxLength={400}
          defaultValue={v("summary", event?.summary ?? "")}
          className={inputCls}
          aria-invalid={!!e.summary}
        />
      </Field>

      <CoverField
        defaultCover={v("cover", event?.cover ?? "")}
        defaultAlt={v("coverAlt", event?.coverAlt ?? "")}
        error={e.cover}
        altError={e.coverAlt}
      />

      <div className="flex flex-col gap-2">
        <span className="font-mono text-overline font-medium text-slate-700 uppercase">
          About the event (optional, Markdown)
        </span>
        <p className="text-[0.8125rem] text-slate-700">
          If you write something here, the event gets its own page and its card
          links to it.
        </p>
        <MarkdownEditor
          name="body"
          defaultValue={v("body", event?.body ?? "")}
          error={e.body}
          rows={14}
        />
      </div>

      <div className="grid items-end gap-5 border-t border-navy/15 pt-6 md:grid-cols-2">
        <Field label="Status">
          <select
            name="status"
            defaultValue={v("status", event?.status ?? "draft")}
            className={inputCls}
          >
            <option value="draft">Draft (hidden)</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{event ? "Save changes" : "Save event"}</SubmitButton>
        <Link href="/sys-ops/events" className={btnOutline}>
          Cancel
        </Link>
        <p
          role="alert"
          aria-live="polite"
          className="text-[0.9375rem] text-orange"
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
