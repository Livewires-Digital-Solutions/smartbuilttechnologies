import "server-only";
import { connection } from "next/server";
import { dbConfigured } from "./db";
import { listLiveEvents, type SiteEvent } from "./events";
import { listOpenJobs, type Job } from "./jobs";
import { listLivePosts, type Post } from "./posts";

export interface LiveContent {
  posts: Post[];
  /** Events that have their own page */
  events: SiteEvent[];
  jobs: Job[];
}

/**
 * Everything the database adds to the site, for the sitemap, llms.txt and the feed.
 * If the database cannot be reached the lists are empty and the fixed pages still work.
 */
export async function loadLiveContent(): Promise<LiveContent> {
  // request time only; kept outside the try so a prerender can stop here
  await connection();
  const empty: LiveContent = { posts: [], events: [], jobs: [] };
  if (!dbConfigured()) return empty;
  try {
    const [posts, events, jobs] = await Promise.all([
      listLivePosts(),
      listLiveEvents(),
      listOpenJobs(),
    ]);
    return {
      posts,
      events: events.filter((e) => e.body?.trim()),
      jobs,
    };
  } catch (e) {
    console.error("[seo] could not read live content:", e);
    return empty;
  }
}

/** The newest of some ISO timestamps, or undefined. */
export const newest = (dates: string[]) =>
  dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : undefined;
