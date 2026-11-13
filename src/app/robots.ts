import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { indexable } from "@/lib/seo";

/** Crawlers that fetch pages to answer questions or to train assistants. All are welcome on the public pages. */
const ASSISTANTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  const rule = { allow: "/", disallow: ["/sys-ops", "/api/"] };
  return {
    rules: [
      { userAgent: "*", ...rule },
      { userAgent: ASSISTANTS, ...rule },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
