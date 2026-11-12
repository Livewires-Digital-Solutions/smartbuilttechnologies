"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveJobAction,
  type JobFormState,
} from "@/app/(admin)/sys-ops/actions";
import { EMPLOYMENT_TYPES, WORK_MODES } from "@/content/careers";
import type { Job } from "@/lib/jobs";
import { SubmitButton, btnOutline, inputCls } from "./ui";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

const DEPARTMENTS = [
  "BIM",
  "Reality capture",
  "Digital twin",
  "Software",
  "Operations",
  "Business",
];

/** Create or edit a job. Keeps everything typed when there is an error. */
export function JobForm({ job }: { job?: Job }) {
  const [state, action] = useActionState<JobFormState, FormData>(
    saveJobAction,
    {},
  );
  const v = (k: string, fallback: string) => state.values?.[k] ?? fallback;
  const [slugTouched, setSlugTouched] = useState(!!job);
  const [title, setTitle] = useState(v("title", job?.title ?? ""));
  const [slug, setSlug] = useState(v("slug", job?.slug ?? ""));
  const e = state.errors ?? {};

  const field = (
    name: keyof typeof e & string,
    label: string,
    node: React.ReactNode,
    hint?: string,
  ) => (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-overline font-medium text-slate-700 uppercase">
        {label}
      </span>
      {node}
      {hint ? (
        <span className="text-[0.8125rem] text-slate-700">{hint}</span>
      ) : null}
      {e[name as keyof typeof e] ? (
        <span role="alert" className="text-[0.875rem] text-orange">
          {e[name as keyof typeof e]}
        </span>
      ) : null}
    </label>
  );
  const inv = (k: keyof typeof e) => ({ "aria-invalid": !!e[k] });

  return (
    <form
      action={action}
      className="flex flex-col gap-8"
      aria-label={job ? "Edit job" : "New job"}
    >
      {job ? <input type="hidden" name="id" value={job.id} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        {field(
          "title",
          "Job title",
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
            placeholder="BIM Modeller (MEP)"
            {...inv("title")}
          />,
        )}
        {field(
          "slug",
          "Web address",
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[0.875rem] text-slate-700">
              /careers/
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
              {...inv("slug")}
            />
          </div>,
          "Made from the title. Changing it breaks links already shared.",
        )}
        {field(
          "department",
          "Department",
          <>
            <input
              name="department"
              required
              maxLength={80}
              list="departments"
              defaultValue={v("department", job?.department ?? "BIM")}
              className={inputCls}
              {...inv("department")}
            />
            <datalist id="departments">
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </>,
        )}
        {field(
          "location",
          "Location",
          <input
            name="location"
            required
            maxLength={120}
            defaultValue={v("location", job?.location ?? "Chennai, India")}
            className={inputCls}
            placeholder="Chennai, India"
            {...inv("location")}
          />,
        )}
        {field(
          "employmentType",
          "Employment type",
          <select
            name="employmentType"
            defaultValue={v(
              "employmentType",
              job?.employmentType ?? "full_time",
            )}
            className={inputCls}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>,
        )}
        {field(
          "workMode",
          "Work mode",
          <select
            name="workMode"
            defaultValue={v("workMode", job?.workMode ?? "onsite")}
            className={inputCls}
          >
            {WORK_MODES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>,
        )}
        {field(
          "experience",
          "Experience (optional)",
          <input
            name="experience"
            maxLength={80}
            defaultValue={v("experience", job?.experience ?? "")}
            className={inputCls}
            placeholder="3 to 5 years"
            {...inv("experience")}
          />,
        )}
        {field(
          "salary",
          "Salary (optional)",
          <input
            name="salary"
            maxLength={120}
            defaultValue={v("salary", job?.salary ?? "")}
            className={inputCls}
            placeholder="Competitive, or a range"
            {...inv("salary")}
          />,
        )}
      </div>

      {field(
        "summary",
        "Summary",
        <textarea
          name="summary"
          required
          rows={2}
          maxLength={400}
          defaultValue={v("summary", job?.summary ?? "")}
          className={inputCls}
          placeholder="One or two lines shown in the list of open positions."
          {...inv("summary")}
        />,
      )}
      {field(
        "description",
        "About the role (optional)",
        <textarea
          name="description"
          rows={6}
          defaultValue={v("description", job?.description ?? "")}
          className={inputCls}
          {...inv("description")}
        />,
        "Leave a blank line between paragraphs.",
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {(
          [
            ["responsibilities", "Responsibilities", job?.responsibilities],
            ["requirements", "Requirements", job?.requirements],
            ["benefits", "Benefits", job?.benefits],
          ] as const
        ).map(([name, label, items]) =>
          field(
            name,
            `${label} (optional)`,
            <textarea
              name={name}
              rows={7}
              defaultValue={v(name, items?.join("\n") ?? "")}
              className={inputCls}
              {...inv(name)}
            />,
            "One item per line.",
          ),
        )}
      </div>

      <div className="grid items-end gap-5 border-t border-navy/15 pt-6 md:grid-cols-3">
        {field(
          "status",
          "Status",
          <select
            name="status"
            defaultValue={v("status", job?.status ?? "draft")}
            className={inputCls}
          >
            <option value="draft">Draft (hidden)</option>
            <option value="open">Open (listed, taking applications)</option>
            <option value="closed">Closed (link works, no applications)</option>
          </select>,
        )}
        {field(
          "closesOn",
          "Closing date (optional)",
          <input
            name="closesOn"
            type="date"
            defaultValue={v("closesOn", job?.closesOn ?? "")}
            className={inputCls}
            {...inv("closesOn")}
          />,
          "After this day the job leaves the list by itself.",
        )}
        <label className="flex items-center gap-3 pb-2.5">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={
              state.values ? state.values.featured === "on" : job?.featured
            }
            className="size-4 accent-orange"
          />
          <span className="text-[0.9375rem]">
            Feature at the top of the list
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{job ? "Save changes" : "Save job"}</SubmitButton>
        <Link href="/sys-ops/jobs" className={btnOutline}>
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
