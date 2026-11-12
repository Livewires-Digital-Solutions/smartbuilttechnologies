/**
 * Careers copy and the labels shared by the public pages and the admin area.
 * Wording is the group's own (txgksa.com/careers, crawled 12 Nov 2026), except that
 * the contact address is Smart Built Technologies'.
 */

export type EmploymentType = "full_time" | "part_time" | "contract" | "internship";
export type WorkMode = "onsite" | "hybrid" | "remote";
export type JobStatus = "draft" | "open" | "closed";
export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "offered"
  | "hired"
  | "rejected";

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "full_time", label: "Full time" },
  { value: "part_time", label: "Part time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: "onsite", label: "On site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

export const employmentLabel = (v: EmploymentType) =>
  EMPLOYMENT_TYPES.find((x) => x.value === v)?.label ?? v;
export const workModeLabel = (v: WorkMode) =>
  WORK_MODES.find((x) => x.value === v)?.label ?? v;

/** The order a candidate moves through. "Rejected" is the exit. */
export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  /** Tailwind classes for the badge */
  tone: string;
}[] = [
  { value: "new", label: "New", tone: "bg-orange/15 text-navy" },
  { value: "reviewing", label: "Reviewing", tone: "bg-sky/30 text-navy" },
  { value: "shortlisted", label: "Shortlisted", tone: "bg-cobalt/15 text-cobalt" },
  { value: "interview", label: "Interview", tone: "bg-cobalt/25 text-navy" },
  { value: "offered", label: "Offered", tone: "bg-navy/12 text-navy" },
  { value: "hired", label: "Hired", tone: "bg-navy text-white" },
  { value: "rejected", label: "Rejected", tone: "bg-slate-200 text-slate-700" },
];

export const statusLabel = (v: ApplicationStatus) =>
  APPLICATION_STATUSES.find((x) => x.value === v)?.label ?? v;

/** The "Select Position" choices on the general application form, as txgksa.com lists them. */
export const GENERAL_POSITIONS = [
  "BIM Modeller",
  "BIM Engineer",
  "Team Leader",
  "BIM Coordinator",
  "Other",
] as const;

/** The three role families on the careers page, in the group's words. */
export const roleFamilies = [
  {
    title: "BIM Modellers & Engineers",
    line: "Driving architectural design forward.",
  },
  { title: "Team Leaders", line: "Guiding ambitious projects to success." },
  { title: "BIM Coordinators", line: "Seamless discipline integration." },
] as const;

export const CV_MAX_MB = 5;
export const CV_ACCEPT = ".pdf,.doc,.docx";
