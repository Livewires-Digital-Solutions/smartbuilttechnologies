/**
 * News and articles (source: txgksa.com/blog). Titles and dates are the published ones.
 * Standfirsts marked DRAFT are short placeholders until the articles are expanded
 * for SBT (PLAN.md §2: thin 2023 posts).
 */

export interface JournalItem {
  slug: string;
  title: string;
  standfirst: string;
  /** ISO date */
  date: string;
  kind: "news" | "article";
  image?: { src: string; width: number; height: number };
}

export const latestNews: JournalItem = {
  slug: "digital-twin-operations-middle-east",
  title: "TXG expands digital twin operations across the Middle East",
  standfirst:
    "Building on its work in Saudi Arabia, TXG is expanding digital twin services to the UAE and Bahrain, enabling smarter infrastructure management across the region.",
  date: "2026-06-28",
  kind: "news",
};

export const articles: JournalItem[] = [
  {
    slug: "scan-to-bim-process-accuracy-deliverables",
    title:
      "Scan-to-BIM explained: from laser scanning to an accurate as-built model",
    standfirst:
      "How scan-to-BIM turns point clouds into 3D models, what affects accuracy, and how to plan the deliverables.",
    date: "2026-10-23",
    kind: "article",
    image: {
      src: "/assets/blog/scan-to-bim-process-accuracy-deliverables.jpg",
      width: 1170,
      height: 658,
    },
  },
  {
    slug: "adopting-bim-is-cost-the-biggest-barrier",
    title: "Adopting BIM in projects: is cost really the biggest barrier?",
    standfirst:
      "Where BIM genuinely delivers value, and how to approach adoption project-first.",
    date: "2026-09-25",
    kind: "article",
  },
  {
    slug: "digital-twins-vs-building-management-systems",
    title: "Digital twins vs building management systems (BMS)",
    standfirst:
      "DRAFT · What a digital twin adds to a building management system, and what it does not replace.",
    date: "2023-05-08",
    kind: "article",
  },
  {
    slug: "a-closer-look-at-bim-in-construction",
    title: "A closer look at BIM in construction",
    standfirst:
      "DRAFT · The benefits of BIM over traditional building methods.",
    date: "2023-05-08",
    kind: "article",
  },
  {
    slug: "an-introduction-to-building-information-modelling",
    title: "An introduction to Building Information Modelling (BIM)",
    standfirst:
      "DRAFT · How BIM is transforming architecture, engineering and construction.",
    date: "2023-05-08",
    kind: "article",
  },
  {
    slug: "what-is-digital-twin",
    title: "What is a digital twin?",
    standfirst: "DRAFT · A game-changer in BIM and construction, explained.",
    date: "2023-01-09",
    kind: "article",
  },
];

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
