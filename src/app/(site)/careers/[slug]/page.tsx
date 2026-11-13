import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { JobView } from "@/components/sections/careers/JobView";
import { dbConfigured } from "@/lib/db";
import { getPublicJob, type Job } from "@/lib/jobs";

async function load(slug: string): Promise<Job | null> {
  // request time only; kept outside the try so the prerender can stop here
  await connection();
  if (!dbConfigured()) return null;
  try {
    return await getPublicJob(slug);
  } catch (e) {
    console.error("[careers] could not load job:", e);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const job = await load((await params).slug);
  if (!job) return { title: "Position not found", robots: { index: false } };
  return pageMetadata({
    title: `${job.title} | Careers | Smart Built Technologies`,
    description: `${job.summary} ${job.location}. Apply to Smart Built Technologies, the production firm of Technical Xperts Group (TXG) - Saudi Arabia.`,
    path: `/careers/${job.slug}`,
  });
}

/** One position, read from the database when it is asked for. */
export default function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // `params` is read inside Suspense, as Partial Prefetching requires.
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <JobContent params={params} />
    </Suspense>
  );
}

async function JobContent({ params }: { params: Promise<{ slug: string }> }) {
  const job = await load((await params).slug);
  if (!job) notFound();
  return <JobView job={job} />;
}
