import { pathways } from "./pathways";
import { assetTaggingLink, servicesByPathway } from "./services";

export interface NavLink {
  label: string;
  href: string;
}

/** Main navigation — mirrors txgksa.com (PLAN.md §4). Services opens the mega-menu. */
export const mainNav: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
];

export interface MenuService {
  title: string;
  href: string;
  summary: string;
}

/** Services grouped by the four pathways, with asset tagging listed under Precision. */
export const servicesMenu = pathways.map((p) => {
  const items: MenuService[] = servicesByPathway(p.id).map((s) => ({
    title: s.shortTitle,
    href: `/services/${s.slug}`,
    summary: s.summary,
  }));
  if (p.id === "precision") {
    items.push({
      title: assetTaggingLink.title,
      href: assetTaggingLink.href,
      summary: assetTaggingLink.summary,
    });
  }
  return { pathway: p, items };
});

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Events", href: "/events" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "BIM in design", href: "/services/bim" },
      { label: "Reality capture", href: "/services/reality-capture" },
      { label: "Digital twin", href: "/services/digital-twin" },
      { label: "Asset management", href: "/services/asset-management" },
      { label: "All services", href: "/services" },
    ],
  },
  {
    title: "Journal",
    links: [
      { label: "Blog", href: "/blog" },
      {
        label: "Scan to BIM, explained",
        href: "/blog/scan-to-bim-process-accuracy-deliverables",
      },
      { label: "What is a digital twin?", href: "/blog/what-is-digital-twin" },
    ],
  },
];

export const legalNav: NavLink[] = [{ label: "Privacy", href: "/privacy" }];
