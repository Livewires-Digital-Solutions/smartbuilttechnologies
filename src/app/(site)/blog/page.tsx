import type { Metadata } from "next";
import { Suspense } from "react";
import {
  BlogContent,
  BlogSkeleton,
} from "@/components/sections/blog/BlogContent";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

const title = "Blog | Smart Built Technologies, Production Firm of TXG, KSA";
const description =
  "Deep dives into BIM, digital twin, scan to BIM, GIS integration and CAFM from Smart Built Technologies, the production firm of Technical Xperts Group (TXG) - Saudi Arabia, plus company news.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title, description, url: "/blog", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/** Blog index: the latest news and every article, read from the database. */
export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent />
      </Suspense>
      <HomeCta />
    </>
  );
}
