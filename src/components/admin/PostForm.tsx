"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  savePostAction,
  type ContentFormState,
} from "@/app/(admin)/sys-ops/content-actions";
import type { Post, PostErrors } from "@/lib/posts";
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

/** Create or edit a blog post or news item. Keeps everything typed when there is an error. */
export function PostForm({
  post,
  categories,
}: {
  post?: Post;
  categories: string[];
}) {
  const [state, action] = useActionState<
    ContentFormState<PostErrors>,
    FormData
  >(savePostAction, {});
  const v = (k: string, fallback: string) => state.values?.[k] ?? fallback;
  const e = state.errors ?? {};
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [title, setTitle] = useState(v("title", post?.title ?? ""));
  const [slug, setSlug] = useState(v("slug", post?.slug ?? ""));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={action}
      className="flex flex-col gap-8"
      aria-label={post ? "Edit post" : "New post"}
    >
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

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
          hint="Made from the title. Changing it breaks links already shared."
        >
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[0.875rem] text-slate-700">
              /blog/
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
        <Field label="Type">
          <select
            name="kind"
            defaultValue={v("kind", post?.kind ?? "article")}
            className={inputCls}
          >
            <option value="article">Article</option>
            <option value="news">Company news</option>
          </select>
        </Field>
        <Field label="Category (optional)" error={e.category}>
          <>
            <input
              name="category"
              maxLength={60}
              list="post-categories"
              defaultValue={v("category", post?.category ?? "")}
              className={inputCls}
              placeholder="BIM, Digital twin, Company Update…"
              aria-invalid={!!e.category}
            />
            <datalist id="post-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </>
        </Field>
      </div>

      <Field
        label="Summary"
        error={e.excerpt}
        hint="Shown in lists and in search results. Leave it empty to use the first sentence of the text."
      >
        <textarea
          name="excerpt"
          rows={2}
          maxLength={400}
          defaultValue={v("excerpt", post?.excerpt ?? "")}
          className={inputCls}
          aria-invalid={!!e.excerpt}
        />
      </Field>

      <CoverField
        defaultCover={v("cover", post?.cover ?? "")}
        defaultAlt={v("coverAlt", post?.coverAlt ?? "")}
        error={e.cover}
        altError={e.coverAlt}
      />

      <div className="flex flex-col gap-2">
        <span className="font-mono text-overline font-medium text-slate-700 uppercase">
          Text (Markdown)
        </span>
        <MarkdownEditor
          name="body"
          defaultValue={v("body", post?.body ?? "")}
          error={e.body}
        />
      </div>

      <div className="grid items-end gap-5 border-t border-navy/15 pt-6 md:grid-cols-2">
        <Field label="Status">
          <select
            name="status"
            defaultValue={v("status", post?.status ?? "draft")}
            className={inputCls}
          >
            <option value="draft">Draft (hidden)</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field
          label="Publish date"
          error={e.publishedAt}
          hint="Shown on the post. A date in the future holds the post back until that day."
        >
          <input
            name="publishedAt"
            type="date"
            defaultValue={v(
              "publishedAt",
              post?.publishedAt.slice(0, 10) ?? today,
            )}
            className={inputCls}
            aria-invalid={!!e.publishedAt}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{post ? "Save changes" : "Save post"}</SubmitButton>
        <Link href="/sys-ops/blog" className={btnOutline}>
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
