"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Typography";
import { employmentLabel, workModeLabel } from "@/content/careers";
import type { Job } from "@/lib/jobs";
import { cn } from "@/lib/cn";

const unique = (xs: string[]) =>
  [...new Set(xs)].sort((a, b) => a.localeCompare(b));

const closing = (d: string | null) =>
  d
    ? new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

const selectClass =
  "h-11 min-w-[11rem] cursor-pointer rounded-[var(--radius-button)] border border-navy/25 bg-transparent px-3 text-[0.9375rem] text-navy hover:border-navy focus-visible:border-navy";

/**
 * The open positions as ruled, big-type rows, with filters by department, location and
 * employment type when there is enough to filter. With no open roles it points to the
 * general application instead.
 */
export function OpeningsList({
  jobs,
  unavailable,
}: {
  jobs: Job[];
  unavailable?: boolean;
}) {
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const departments = unique(jobs.map((j) => j.department));
  const locations = unique(jobs.map((j) => j.location));
  const types = unique(jobs.map((j) => j.employmentType));
  const shown = jobs.filter(
    (j) =>
      (!department || j.department === department) &&
      (!location || j.location === location) &&
      (!type || j.employmentType === type),
  );
  const filtered = !!(department || location || type);

  if (unavailable) {
    return (
      <p className="mt-12 max-w-[56ch] border-t-[1.5px] border-t-navy pt-6 text-lead text-slate-700">
        Open positions cannot be shown right now. You can still send your CV
        with the form below.
      </p>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="mt-12 flex flex-col gap-4 border-t-[1.5px] border-t-navy pt-6 lg:mt-16">
        <p className="text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance">
          No open roles right now.
        </p>
        <p className="max-w-[52ch] text-lead text-slate-700">
          We are always glad to meet good BIM people. Send your CV anyway and we
          will keep it for the next project.
        </p>
        <a
          href="#apply"
          className="group inline-flex items-center gap-2 self-start font-semibold text-navy"
        >
          <span className="underline underline-offset-[6px]">Send your CV</span>
          <Icon
            name="arrow-right"
            size={16}
            className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
          />
        </a>
      </div>
    );
  }

  return (
    <div className="mt-12 lg:mt-16">
      {jobs.length > 1 ? (
        <div
          role="group"
          aria-label="Filter open positions"
          className="mb-8 flex flex-wrap items-end gap-4"
        >
          {[
            [
              "Department",
              department,
              setDepartment,
              departments.map((d) => [d, d]),
            ],
            ["Location", location, setLocation, locations.map((d) => [d, d])],
            [
              "Type",
              type,
              setType,
              types.map((t) => [
                t,
                employmentLabel(t as Job["employmentType"]),
              ]),
            ],
          ].map(([label, value, set, options]) => {
            const opts = options as string[][];
            if (opts.length < 2) return null;
            return (
              <label key={label as string} className="flex flex-col gap-1.5">
                <Label className="text-slate-700">{label as string}</Label>
                <select
                  value={value as string}
                  onChange={(e) => (set as (v: string) => void)(e.target.value)}
                  className={selectClass}
                >
                  <option value="">All</option>
                  {opts.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
          {filtered ? (
            <button
              type="button"
              onClick={() => {
                setDepartment("");
                setLocation("");
                setType("");
              }}
              className="h-11 font-semibold text-navy underline underline-offset-[5px]"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {shown.length} open positions
      </p>

      {shown.length === 0 ? (
        <p className="border-t-[1.5px] border-t-navy pt-6 text-lead text-slate-700">
          No open positions match those filters.
        </p>
      ) : (
        <ul className="border-t-[1.5px] border-t-navy">
          {shown.map((j, i) => (
            <li key={j.id} className="border-b border-[var(--hairline)]">
              <Link
                href={`/careers/${j.slug}`}
                className="group grid grid-cols-12 items-start gap-x-6 gap-y-3 py-7 transition-colors hover:bg-white lg:py-9"
              >
                <span className="col-span-2 pt-2 font-mono text-overline text-slate-500 lg:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-10 flex flex-col gap-2 lg:col-span-6">
                  <span
                    className={cn(
                      "text-[clamp(1.75rem,1.2rem+2.2vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.045em] text-balance",
                      "transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1.5",
                    )}
                  >
                    {j.title}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {j.featured ? (
                      <span className="bg-orange px-2 py-1 font-mono text-overline font-medium text-navy uppercase">
                        Featured
                      </span>
                    ) : null}
                    <Label className="text-slate-700">{j.department}</Label>
                  </span>
                </span>
                <span className="col-span-12 flex flex-col gap-2 lg:col-span-4">
                  <span className="max-w-[44ch] text-[0.9375rem] text-slate-700">
                    {j.summary}
                  </span>
                  <span className="flex flex-wrap gap-x-4 gap-y-1">
                    <Label className="text-navy">{j.location}</Label>
                    <Label className="text-slate-700">
                      {employmentLabel(j.employmentType)}
                    </Label>
                    <Label className="text-slate-700">
                      {workModeLabel(j.workMode)}
                    </Label>
                    {j.closesOn ? (
                      <Label className="text-slate-700">
                        Closes {closing(j.closesOn)}
                      </Label>
                    ) : null}
                  </span>
                </span>
                <Icon
                  name="arrow-right"
                  size={22}
                  className="col-span-12 mt-1 hidden text-slate-500 transition-[translate,color] duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-navy lg:col-span-1 lg:block lg:justify-self-end"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
