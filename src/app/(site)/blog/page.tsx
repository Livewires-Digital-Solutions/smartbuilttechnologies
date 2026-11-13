import type { Metadata } from "next";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import {
  BlogContent,
  BlogSkeleton,
} from "@/components/sections/blog/BlogContent";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { JsonLd, pageJsonLd } from "@/lib/jsonld";

const title =
  "BIM and Digital Twin Blog | Smart Built Technologies";
const description =
  "Articles on BIM, digital twins, scan to BIM, GIS integration and CAFM from Smart Built Technologies, the production firm of TXG - Saudi Arabia, plus company news.";

export const metadata: Metadata = {
  ...pageMetadata({ title, description, path: "/blog" }),
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/feed.xml" },
  },
};

/** Blog index: the latest news and every article, read from the database. */
export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/blog",
          name: title,
          description,
          type: "CollectionPage",
          crumbs: [{ name: "Blog", path: "/blog" }],
          extra: [
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              "@id": `${site.url}/blog#blog`,
              url: `${site.url}/blog`,
              name: "Smart Built Technologies Blog",
              inLanguage: "en-IN",
              publisher: { "@id": `${site.url}/#organization` },
            },
          ],
        })}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent />
      </Suspense>
      <HomeCta />
    </>
  );
}
