import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";
import { loadLiveContent } from "@/lib/site-index";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** RSS feed of the blog, for readers, search engines and assistants that follow feeds. */
export async function GET() {
  const { posts } = await loadLiveContent();
  const items = posts.slice(0, 30).map((p) => {
    const url = absoluteUrl(`/blog/${p.slug}`);
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
${p.category ? `      <category>${esc(p.category)}</category>\n` : ""}      <description>${esc(p.excerpt)}</description>
    </item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} Blog</title>
    <link>${absoluteUrl("/blog")}</link>
    <atom:link href="${absoluteUrl("/blog/feed.xml")}" rel="self" type="application/rss+xml" />
    <description>${esc(`BIM, digital twin, scan to BIM and digital construction, from ${site.name}, the production firm of ${site.group}.`)}</description>
    <language>en-in</language>
${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
