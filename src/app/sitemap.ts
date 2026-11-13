import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { absoluteUrl } from "@/lib/seo";
import { loadLiveContent, newest } from "@/lib/site-index";

/**
 * Every public page. Fixed pages carry no date (an invented one would be worse than
 * none); pages that come from the database carry the day they were last edited.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, events, jobs } = await loadLiveContent();
  const fixed = [
    "/",
    "/about",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/projects",
    "/contact",
    "/privacy",
  ];
  return [
    ...fixed.map((p) => ({
      url: absoluteUrl(p),
      changeFrequency: "monthly" as const,
      priority: p === "/" ? 1 : p.startsWith("/services") ? 0.8 : 0.6,
    })),
    {
      url: absoluteUrl("/careers"),
      lastModified: newest(jobs.map((j) => j.updatedAt)),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...jobs.map((j) => ({
      url: absoluteUrl(`/careers/${j.slug}`),
      lastModified: j.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    {
      url: absoluteUrl("/blog"),
      lastModified: newest(posts.map((p) => p.updatedAt)),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: absoluteUrl("/events"),
      lastModified: newest(events.map((e) => e.updatedAt)),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...events.map((e) => ({
      url: absoluteUrl(`/events/${e.slug}`),
      lastModified: e.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
