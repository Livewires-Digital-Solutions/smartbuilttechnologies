import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Search engines should only index the real site. The client-review copy on Vercel
 * (no database, a placeholder domain) is kept out of results; the VPS is indexed.
 */
export const indexable = !process.env.VERCEL;

/** An absolute address on this site. */
export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** A description that fits a search result: whole words, at most 160 characters. */
export function clip(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\-–]+$/, "")}…`;
}

/** Metadata for a public page: one place so every page gets canonical, social and robots the same way. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  /** Full title, brand included */
  title: string;
  description: string;
  path: string;
  /** Site-relative or absolute picture for link previews; falls back to the generated card */
  image?: { src: string; alt: string; width?: number; height?: number } | null;
  type?: "website" | "article";
}): Metadata {
  description = clip(description);
  // every page gets a preview picture: its own, or the generated brand card
  const images = image
    ? [
        {
          url: image.src,
          alt: image.alt,
          width: image.width,
          height: image.height,
        },
      ]
    : [
        {
          url: "/opengraph-image",
          alt: `${site.name}: BIM and digital construction`,
          width: 1200,
          height: 630,
        },
      ];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type,
      siteName: site.name,
      locale: site.locale,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}
