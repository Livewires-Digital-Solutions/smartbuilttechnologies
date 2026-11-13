import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ArticleView } from "@/components/sections/blog/ArticleView";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { dbConfigured } from "@/lib/db";
import { getLivePost, relatedPosts, type Post } from "@/lib/posts";

async function load(slug: string): Promise<Post | null> {
  // request time only; kept outside the try so the prerender can stop here
  await connection();
  if (!dbConfigured()) return null;
  try {
    return await getLivePost(slug);
  } catch (e) {
    console.error("[blog] could not load post:", e);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await load((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const meta = pageMetadata({
    title: `${post.title} | Smart Built Technologies`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.cover
      ? { src: post.cover, alt: post.coverAlt ?? post.title }
      : null,
  });
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ["Smart Built Technologies"],
      section: post.category ?? undefined,
    },
  };
}

/** One post, read from the database when it is asked for. */
export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // `params` is read inside Suspense, as Partial Prefetching requires.
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const post = await load((await params).slug);
  if (!post) notFound();
  let related: Post[] = [];
  try {
    related = await relatedPosts(post, 3);
  } catch {
    // the article itself is the point; skip the list if it cannot be read
  }
  return (
    <>
      <ArticleView post={post} related={related} />
      <HomeCta />
    </>
  );
}
