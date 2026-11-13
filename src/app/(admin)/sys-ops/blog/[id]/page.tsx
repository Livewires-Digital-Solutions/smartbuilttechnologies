import Link from "next/link";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { PublishBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { adminGetPost, postCategories } from "@/lib/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const id = Number((await params).id);
  const post = Number.isInteger(id) && id > 0 ? await adminGetPost(id) : null;
  if (!post) notFound();
  const categories = await postCategories();
  const scheduled =
    post.status === "published" && post.publishedAt > new Date().toISOString();

  return (
    <div className="flex max-w-[1100px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Blog
          </p>
          <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
            Edit post
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <PublishBadge status={post.status} scheduled={scheduled} />
          {post.status === "published" && !scheduled ? (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="text-[0.9375rem] font-semibold underline underline-offset-[5px]"
            >
              View page
            </Link>
          ) : null}
        </div>
      </div>
      <PostForm post={post} categories={categories} />
    </div>
  );
}
