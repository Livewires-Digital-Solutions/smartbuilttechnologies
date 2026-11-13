"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  createEvent,
  deleteEvent,
  duplicateEvent,
  parseEventForm,
  setEventStatus,
  updateEvent,
  type EventErrors,
} from "@/lib/events";
import {
  createPost,
  deletePost,
  duplicatePost,
  parsePostForm,
  setPostStatus,
  updatePost,
  type PostErrors,
} from "@/lib/posts";

/**
 * Writes for blog posts and events. Like every admin action, each one checks the signed-in
 * session first: hiding a button is not security.
 */

export interface ContentFormState<E> {
  errors?: E;
  message?: string;
  /** What the person typed, so nothing is lost when there is an error */
  values?: Record<string, string>;
}

const strings = (form: FormData) =>
  Object.fromEntries(
    [...form.entries()].filter(([, v]) => typeof v === "string") as [
      string,
      string,
    ][],
  );

// ---- Posts -----------------------------------------------------------------

export async function savePostAction(
  _: ContentFormState<PostErrors>,
  form: FormData,
): Promise<ContentFormState<PostErrors>> {
  await requireAdmin();
  const values = strings(form);
  const parsed = parsePostForm(form);
  if (parsed.errors)
    return {
      errors: parsed.errors,
      message: "Please fix the highlighted fields.",
      values,
    };
  const id = Number(form.get("id") ?? 0);
  try {
    if (id) await updatePost(id, parsed.input!);
    else await createPost(parsed.input!);
  } catch (e) {
    console.error("[admin] could not save post:", e);
    return { message: "Could not save the post. Please try again.", values };
  }
  redirect(`/sys-ops/blog?saved=${id ? "updated" : "created"}`);
}

export async function postStatusAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const status =
    String(form.get("status")) === "published" ? "published" : "draft";
  if (id) await setPostStatus(id, status);
  redirect("/sys-ops/blog");
}

export async function deletePostAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  if (id) await deletePost(id);
  redirect("/sys-ops/blog?saved=deleted");
}

export async function duplicatePostAction(form: FormData) {
  await requireAdmin();
  const newId = await duplicatePost(Number(form.get("id")));
  redirect(newId ? `/sys-ops/blog/${newId}` : "/sys-ops/blog");
}

// ---- Events ----------------------------------------------------------------

export async function saveEventAction(
  _: ContentFormState<EventErrors>,
  form: FormData,
): Promise<ContentFormState<EventErrors>> {
  await requireAdmin();
  const values = strings(form);
  const parsed = parseEventForm(form);
  if (parsed.errors)
    return {
      errors: parsed.errors,
      message: "Please fix the highlighted fields.",
      values,
    };
  const id = Number(form.get("id") ?? 0);
  try {
    if (id) await updateEvent(id, parsed.input!);
    else await createEvent(parsed.input!);
  } catch (e) {
    console.error("[admin] could not save event:", e);
    return { message: "Could not save the event. Please try again.", values };
  }
  redirect(`/sys-ops/events?saved=${id ? "updated" : "created"}`);
}

export async function eventStatusAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const status =
    String(form.get("status")) === "published" ? "published" : "draft";
  if (id) await setEventStatus(id, status);
  redirect("/sys-ops/events");
}

export async function deleteEventAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  if (id) await deleteEvent(id);
  redirect("/sys-ops/events?saved=deleted");
}

export async function duplicateEventAction(form: FormData) {
  await requireAdmin();
  const newId = await duplicateEvent(Number(form.get("id")));
  redirect(newId ? `/sys-ops/events/${newId}` : "/sys-ops/events");
}
