"use server";

import { redirect } from "next/navigation";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobStatus,
} from "@/content/careers";
import {
  deleteApplication,
  setApplicationNotes,
  setApplicationStatus,
} from "@/lib/applications";
import {
  checkCredentials,
  endSession,
  requireAdmin,
  startSession,
} from "@/lib/auth";
import {
  createJob,
  deleteJob,
  duplicateJob,
  parseJobForm,
  setJobStatus,
  updateJob,
  type JobErrors,
} from "@/lib/jobs";
import { allow, clientIp } from "@/lib/rate-limit";
import { removeCv } from "@/lib/uploads";

/**
 * Every admin write is a server action, and every one starts by checking the signed-in
 * session again: hiding a button is not security.
 */

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _: LoginState,
  form: FormData,
): Promise<LoginState> {
  const ip = await clientIp();
  if (!allow(`login:${ip}`, 6, 15 * 60 * 1000)) {
    return {
      error: "Too many attempts. Please wait a few minutes and try again.",
    };
  }
  const ok = checkCredentials(
    String(form.get("username") ?? ""),
    String(form.get("password") ?? ""),
  );
  if (!ok) return { error: "That username and password do not match." };
  await startSession();
  redirect("/sys-ops");
}

export async function logoutAction() {
  await endSession();
  redirect("/sys-ops");
}

export interface JobFormState {
  errors?: JobErrors;
  message?: string;
  /** The values the person typed, so nothing is lost when there is an error */
  values?: Record<string, string>;
}

export async function saveJobAction(
  _: JobFormState,
  form: FormData,
): Promise<JobFormState> {
  await requireAdmin();
  const values = Object.fromEntries(
    [...form.entries()].filter(([, v]) => typeof v === "string") as [
      string,
      string,
    ][],
  );
  const parsed = parseJobForm(form);
  if (parsed.errors) {
    return {
      errors: parsed.errors,
      message: "Please fix the highlighted fields.",
      values,
    };
  }
  const id = Number(form.get("id") ?? 0);
  try {
    if (id) await updateJob(id, parsed.input!);
    else await createJob(parsed.input!);
  } catch (e) {
    console.error("[admin] could not save job:", e);
    return { message: "Could not save the job. Please try again.", values };
  }
  redirect(`/sys-ops/jobs?saved=${id ? "updated" : "created"}`);
}

const JOB_STATUSES: JobStatus[] = ["draft", "open", "closed"];

export async function jobStatusAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const status = String(form.get("status")) as JobStatus;
  if (id && JOB_STATUSES.includes(status)) await setJobStatus(id, status);
  redirect("/sys-ops/jobs");
}

export async function deleteJobAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  if (id) await deleteJob(id);
  redirect("/sys-ops/jobs?saved=deleted");
}

export async function duplicateJobAction(form: FormData) {
  await requireAdmin();
  const newId = await duplicateJob(Number(form.get("id")));
  redirect(newId ? `/sys-ops/jobs/${newId}` : "/sys-ops/jobs");
}

export async function applicationStatusAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const status = String(form.get("status")) as ApplicationStatus;
  if (id && APPLICATION_STATUSES.some((s) => s.value === status)) {
    await setApplicationStatus(id, status);
  }
  // go back to where the change was made, but only ever within the admin area
  const back = String(form.get("back") ?? "");
  redirect(back.startsWith("/sys-ops/") ? back : `/sys-ops/applications/${id}`);
}

export async function applicationNotesAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  if (id)
    await setApplicationNotes(
      id,
      String(form.get("notes") ?? "").slice(0, 5000),
    );
  redirect(`/sys-ops/applications/${id}?saved=notes`);
}

export async function deleteApplicationAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  if (id) {
    const cv = await deleteApplication(id);
    if (cv) await removeCv(cv);
  }
  redirect("/sys-ops/applications?deleted=1");
}
