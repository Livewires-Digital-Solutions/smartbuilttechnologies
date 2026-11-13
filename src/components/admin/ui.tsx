"use client";

import { useFormStatus } from "react-dom";
import type { ComponentProps, ReactNode } from "react";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobStatus,
} from "@/content/careers";
import { cn } from "@/lib/cn";
import { btnDanger, btnPrimary } from "./styles";

/** Small pieces shared by the admin screens. Plain and quick to read, in the site's colours. */

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const s = APPLICATION_STATUSES.find((x) => x.value === status);
  return (
    <span
      className={cn(
        "inline-block rounded-[3px] px-2 py-1 font-mono text-overline font-medium uppercase",
        s?.tone,
      )}
    >
      {s?.label ?? status}
    </span>
  );
}

const JOB_TONE: Record<JobStatus, string> = {
  open: "bg-navy text-white",
  draft: "bg-slate-200 text-slate-700",
  closed: "bg-orange/15 text-navy",
};

export function JobStatusBadge({
  status,
  ended,
}: {
  status: JobStatus;
  ended?: boolean;
}) {
  const label = status === "open" && ended ? "Open (date passed)" : status;
  return (
    <span
      className={cn(
        "inline-block rounded-[3px] px-2 py-1 font-mono text-overline font-medium uppercase",
        status === "open" && ended
          ? "bg-orange/15 text-navy"
          : JOB_TONE[status],
      )}
    >
      {label}
    </span>
  );
}

/** A submit button that shows it is working and cannot be pressed twice. */
export function SubmitButton({
  children,
  pending: label = "Saving…",
  className = btnPrimary,
  ...props
}: { children: ReactNode; pending?: string } & ComponentProps<"button">) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} {...props}>
      {pending ? label : children}
    </button>
  );
}

/** A submit button that asks "are you sure?" first, for deletes. */
export function ConfirmSubmit({
  children,
  message,
  className = btnDanger,
}: {
  children: ReactNode;
  message: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

/** Draft, published, or scheduled (published with a date still to come). */
export function PublishBadge({
  status,
  scheduled,
}: {
  status: "draft" | "published";
  scheduled?: boolean;
}) {
  const label =
    status === "draft" ? "draft" : scheduled ? "scheduled" : "published";
  const tone =
    status === "draft"
      ? "bg-slate-200 text-slate-700"
      : scheduled
        ? "bg-orange/15 text-navy"
        : "bg-navy text-white";
  return (
    <span
      className={cn(
        "inline-block rounded-[3px] px-2 py-1 font-mono text-overline font-medium uppercase",
        tone,
      )}
    >
      {label}
    </span>
  );
}
