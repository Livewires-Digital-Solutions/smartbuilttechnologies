"use client";

import Link from "next/link";
import { useState } from "react";
import { PostCover } from "@/components/sections/blog/PostCover";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

export interface ListEvent {
  slug: string;
  title: string;
  type: string;
  /** Already formatted, e.g. "11–12 November 2024" */
  when: string;
  location: string;
  summary: string | null;
  cover: string | null;
  coverAlt: string | null;
  /** Only events with a write-up have a page of their own */
  hasPage: boolean;
}

function Card({ e, priority }: { e: ListEvent; priority?: boolean }) {
  const inner = (
    <>
      <div className="relative">
        <PostCover
          src={e.cover}
          alt={e.coverAlt ?? e.title}
          label={e.type}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          priority={priority}
          className="aspect-[4/3]"
        />
        <span className="absolute top-0 left-0 bg-paper px-3 py-1.5 font-mono text-overline text-navy uppercase">
          {e.type}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-slate-700">{e.when}</Label>
        <h3 className="flex items-start justify-between gap-3 text-[clamp(1.375rem,1.1rem+0.9vw,1.875rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance">
          {e.title}
          {e.hasPage ? (
            <Icon
              name="arrow-up-right"
              size={20}
              className="mt-1 shrink-0 text-slate-500 transition-[translate,color] duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-navy"
            />
          ) : null}
        </h3>
        <Label className="text-navy">{e.location}</Label>
        {e.summary ? (
          <p className="text-[0.9375rem] text-slate-700">{e.summary}</p>
        ) : null}
      </div>
    </>
  );
  const cls = "group flex flex-col gap-4 border-t-[1.5px] border-t-navy pt-4";
  return e.hasPage ? (
    <Link href={`/insights/${e.slug}`} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** Events as a grid, filtered by type with chips (shown only when there is more than one type). */
export function EventsList({ events }: { events: ListEvent[] }) {
  const [type, setType] = useState("");
  const types = [...new Set(events.map((e) => e.type))].sort();
  const shown = type ? events.filter((e) => e.type === type) : events;
  return (
    <div>
      {types.length > 1 ? (
        <div
          role="group"
          aria-label="Filter by type"
          className="mb-10 flex flex-wrap gap-2"
        >
          {["", ...types].map((t) => {
            const on = type === t;
            return (
              <button
                key={t || "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setType(t)}
                className={cn(
                  "rounded-[var(--radius-button)] border px-3.5 py-2 font-mono text-overline font-medium uppercase transition-colors duration-[var(--duration-ui)]",
                  on
                    ? "border-navy bg-navy text-white"
                    : "border-navy/25 text-navy hover:border-navy",
                )}
              >
                {t || "All"}
              </button>
            );
          })}
        </div>
      ) : null}
      <p aria-live="polite" className="sr-only">
        {shown.length} events
      </p>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((e, i) => (
          <li key={e.slug}>
            <Card e={e} priority={i < 3} />
          </li>
        ))}
      </ul>
      {shown.length === 0 ? (
        <p className="text-lead text-slate-700">No events of that type.</p>
      ) : null}
    </div>
  );
}

export { Card as EventCard };
