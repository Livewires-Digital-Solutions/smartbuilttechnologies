import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { EventView } from "@/components/sections/events/EventView";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { dateRange } from "@/lib/dates";
import { dbConfigured } from "@/lib/db";
import { getLiveEvent, type SiteEvent } from "@/lib/events";

async function load(slug: string): Promise<SiteEvent | null> {
  // request time only; kept outside the try so the prerender can stop here
  await connection();
  if (!dbConfigured()) return null;
  try {
    return await getLiveEvent(slug);
  } catch (e) {
    console.error("[events] could not load event:", e);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const e = await load((await params).slug);
  if (!e) return { title: "Event not found", robots: { index: false } };
  const title = `${e.title} | Events | Smart Built Technologies`;
  const description =
    e.summary ??
    `${e.title}, ${dateRange(e.startDate, e.endDate)}, ${e.location}.`;
  const path = `/insights/${e.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: e.cover
        ? [{ url: e.cover, alt: e.coverAlt ?? e.title }]
        : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** One event, read from the database when it is asked for. */
export default function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // `params` is read inside Suspense, as Partial Prefetching requires.
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <EventContent params={params} />
    </Suspense>
  );
}

async function EventContent({ params }: { params: Promise<{ slug: string }> }) {
  const e = await load((await params).slug);
  if (!e) notFound();
  return (
    <>
      <EventView event={e} />
      <HomeCta />
    </>
  );
}
