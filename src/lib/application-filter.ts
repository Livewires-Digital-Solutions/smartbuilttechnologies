import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/content/careers";
import type { ApplicationFilter } from "./applications";

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) ?? "";

/** Turns an address's ?status=&job=&q=&page= into a filter. Used by the list and the CSV export. */
export function filterFrom(sp: Search): ApplicationFilter {
  const status = one(sp.status);
  const job = one(sp.job);
  return {
    status: APPLICATION_STATUSES.some((s) => s.value === status)
      ? (status as ApplicationStatus)
      : "",
    jobId: job === "general" ? "general" : /^\d+$/.test(job) ? Number(job) : "",
    q: one(sp.q).trim().slice(0, 100),
    page: Math.max(1, Number(one(sp.page)) || 1),
  };
}
