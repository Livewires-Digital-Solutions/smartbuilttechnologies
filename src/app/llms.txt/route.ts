import { pathways } from "@/content/pathways";
import { projects } from "@/content/projects";
import { servicesByPathway } from "@/content/services";
import { site } from "@/content/site";
import { absoluteUrl, indexable } from "@/lib/seo";
import { loadLiveContent } from "@/lib/site-index";

/**
 * llms.txt: a plain Markdown map of the site for AI assistants and search tools (llmstxt.org).
 * It states the facts an assistant needs to describe the company correctly and links to the
 * pages that hold the detail. Only facts the client has confirmed go in; placeholders do not.
 */
export async function GET() {
  if (!indexable) return new Response("Not available", { status: 404 });
  const { posts, jobs } = await loadLiveContent();
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.name} (SBT) is the production firm of ${site.group}. It delivers BIM, scan to BIM, digital twin, CAFM and related digital construction services from a newly opened production centre in Chennai, India, carrying the experience of ${projects.length} landmark projects associated with the group.`,
    "",
    "## Key facts",
    "",
    `- Company: ${site.name} (${site.shortName}), the production firm of ${site.group}.`,
    `- Parent group: ${site.group}, founded in Riyadh in ${site.foundedGroup}; group offices in Riyadh (Saudi Arabia) and Sharjah (UAE).`,
    "- Production centre: Chennai, Tamil Nadu, India.",
    `- Track record: ${projects.length} landmark projects in Saudi Arabia and Australia associated with the group, including King Abdullah Financial District, Riyadh Metro and Jeddah Opera House.`,
    "- Services: building information modelling (BIM), reality capture and scan to BIM, digital twins, asset management, CAFM, GIS and smart cities, immersive AR/VR/XR, 4D construction simulation, and IT services.",
    "- Standards: BIM work follows ISO 19650.",
    "- Languages: English.",
    "",
    "## Company",
    "",
    `- [About us](${absoluteUrl("/about")}): who we are, the group, our offices and principles`,
    `- [Projects](${absoluteUrl("/projects")}): ${projects.length} landmark projects associated with ${site.groupLabel}`,
    `- [Contact](${absoluteUrl("/contact")}): offices and how to start a project`,
    `- [Careers](${absoluteUrl("/careers")}): open positions and how to apply`,
    `- [Privacy](${absoluteUrl("/privacy")}): how we handle personal data`,
    "",
    "## Services",
    "",
    `- [All services](${absoluteUrl("/services")}): nine services in four pathways`,
  ];
  for (const p of pathways) {
    for (const s of servicesByPathway(p.id)) {
      lines.push(
        `- [${s.title}](${absoluteUrl(`/services/${s.slug}`)}): ${s.summary}`,
      );
    }
  }
  if (posts.length) {
    lines.push("", "## Articles and news", "");
    lines.push(
      `- [Blog](${absoluteUrl("/blog")}): all articles (RSS: ${absoluteUrl("/blog/feed.xml")})`,
    );
    for (const post of posts.slice(0, 20)) {
      lines.push(
        `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.excerpt.replace(/\s+/g, " ")}`,
      );
    }
  }
  if (jobs.length) {
    lines.push("", "## Open positions", "");
    for (const j of jobs) {
      lines.push(
        `- [${j.title}](${absoluteUrl(`/careers/${j.slug}`)}): ${j.location}`,
      );
    }
  }
  lines.push(
    "",
    "## Optional",
    "",
    `- [Events](${absoluteUrl("/events")}): exhibitions and milestones`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    "",
  );
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
