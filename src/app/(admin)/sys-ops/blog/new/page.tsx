import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/auth";
import { postCategories } from "@/lib/posts";

export default async function NewPostPage() {
  await requireAdmin();
  const categories = await postCategories();
  return (
    <div className="flex max-w-[1100px] flex-col gap-6">
      <div>
        <p className="font-mono text-overline font-medium text-slate-700 uppercase">
          Blog
        </p>
        <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
          Write a post
        </h1>
      </div>
      <PostForm categories={categories} />
    </div>
  );
}
