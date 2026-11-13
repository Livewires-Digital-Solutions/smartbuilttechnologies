import Link from "next/link";
import {
  deletePostAction,
  duplicatePostAction,
  postStatusAction,
} from "@/app/(admin)/sys-ops/content-actions";
import {
  btnOutline,
  btnPrimary,
  btnSignal,
  inputCls,
} from "@/components/admin/styles";
import { ConfirmSubmit, PublishBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { shortDate } from "@/lib/dates";
import { adminListPosts } from "@/lib/posts";

const NOTICE: Record<string, string> = {
  created: "Post saved.",
  updated: "Changes saved.",
  deleted: "Post deleted.",
};

export default async function BlogAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; q?: string }>;
}) {
  await requireAdmin();
  const { saved, q = "" } = await searchParams;
  const search = q.trim().slice(0, 100);
  const posts = await adminListPosts(search);
  const now = new Date().toISOString();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Blog
          </p>
          <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
            Articles and news
          </h1>
        </div>
        <Link href="/sys-ops/blog/new" className={btnSignal}>
          Write a post
        </Link>
      </div>

      {saved && NOTICE[saved] ? (
        <p
          role="status"
          className="border border-navy/25 bg-white px-4 py-3 text-[0.9375rem]"
        >
          {NOTICE[saved]}
        </p>
      ) : null}

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 border border-navy/15 bg-white p-4"
      >
        <label className="flex min-w-[14rem] flex-1 flex-col gap-1.5">
          <span className="font-mono text-overline font-medium text-slate-700 uppercase">
            Search
          </span>
          <input
            name="q"
            defaultValue={search}
            placeholder="Title, category or web address"
            className={inputCls}
          />
        </label>
        <button type="submit" className={btnPrimary}>
          Search
        </button>
        {search ? (
          <Link href="/sys-ops/blog" className={btnOutline}>
            Clear
          </Link>
        ) : null}
      </form>

      {posts.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border border-navy/15 bg-white p-8">
          <p className="text-[1.25rem] font-medium tracking-[-0.02em]">
            {search ? "Nothing matches that search." : "No posts yet."}
          </p>
          {!search ? (
            <>
              <p className="max-w-[50ch] text-slate-700">
                Write your first article. A draft stays hidden until you publish
                it. If this is a fresh install, run <code>npm run db:seed</code>{" "}
                to load the starter articles and events.
              </p>
              <Link href="/sys-ops/blog/new" className={btnSignal}>
                Write a post
              </Link>
            </>
          ) : null}
        </div>
      ) : (
        <ul className="border border-navy/15 bg-white">
          {posts.map((p) => {
            const scheduled = p.status === "published" && p.publishedAt > now;
            return (
              <li
                key={p.id}
                className="grid gap-x-6 gap-y-3 border-b border-navy/10 p-4 last:border-b-0 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/sys-ops/blog/${p.id}`}
                      className="text-[1.125rem] font-semibold underline-offset-[5px] hover:underline"
                    >
                      {p.title}
                    </Link>
                    <PublishBadge status={p.status} scheduled={scheduled} />
                    <span className="font-mono text-overline text-slate-700 uppercase">
                      {p.kind === "news" ? "News" : "Article"}
                    </span>
                  </div>
                  <p className="text-[0.9375rem] text-slate-700">
                    {shortDate(p.publishedAt)}
                    {p.category ? ` · ${p.category}` : ""} · /blog/{p.slug}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/sys-ops/blog/${p.id}`} className={btnOutline}>
                    Edit
                  </Link>
                  {p.status === "published" && !scheduled ? (
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className={btnOutline}
                    >
                      View
                    </Link>
                  ) : null}
                  <form action={postStatusAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={p.status === "published" ? "draft" : "published"}
                    />
                    <button type="submit" className={btnOutline}>
                      {p.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={duplicatePostAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className={btnOutline}>
                      Duplicate
                    </button>
                  </form>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmSubmit
                      message={`Delete "${p.title}"? This cannot be undone.`}
                    >
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
