import { site } from "@/content/site";

type Json = Record<string, unknown>;

/** Renders JSON-LD safely (escapes `<` so content can never close the script tag). */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

const postal = (o: { city: string; country: string }) => ({
  "@type": "PostalAddress",
  addressLocality: o.city,
  addressCountry: o.country,
});

/**
 * The one description of the company, shared by every page through its @id so search
 * engines and assistants see a single entity. Only confirmed facts: the placeholder
 * telephone, email and street address are left out until the client supplies them.
 */
export function organizationJsonLd(): Json {
  const head = site.offices.find((o) => o.primary);
  const groupOffices = site.offices.filter((o) => !o.primary);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    alternateName: [site.shortName],
    url: site.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${site.url}/#logo`,
      url: `${site.url}/icon.svg`,
      caption: site.name,
    },
    image: `${site.url}/opengraph-image`,
    slogan: site.tagline,
    description: site.description,
    knowsAbout: [
      "Building Information Modelling (BIM)",
      "Scan to BIM",
      "Reality capture",
      "Digital twin",
      "CAFM",
      "Asset management",
      "GIS integration",
      "4D construction simulation",
      "ISO 19650",
    ],
    areaServed: ["Saudi Arabia", "United Arab Emirates", "India", "Australia"].map(
      (name) => ({ "@type": "Country", name }),
    ),
    address: head ? { ...postal(head), addressRegion: "Tamil Nadu", addressCountry: "IN" } : undefined,
    parentOrganization: {
      "@type": "Organization",
      name: site.group,
      alternateName: site.groupShort,
      url: site.groupUrl,
      foundingDate: String(site.foundedGroup),
      location: groupOffices.map((o) => ({
        "@type": "Place",
        name: `${o.city}, ${o.country}`,
        address: postal(o),
      })),
    },
    sameAs: site.socials.length ? site.socials.map((s) => s.href) : undefined,
  };
}

/** The website as a whole, referenced by each page. */
export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  };
}

type PageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "ProfilePage";

/** One page of the site, tied to the website and the company. */
export function webPageJsonLd({
  path,
  name,
  description,
  type = "WebPage",
  image,
}: {
  path: string;
  name: string;
  description: string;
  type?: PageType;
  image?: string;
}): Json {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: image ? { "@type": "ImageObject", url: image.startsWith("http") ? image : `${site.url}${image}` } : undefined,
  };
}

/** A list of things on a page (services, projects, posts), so the page reads as an index. */
export function itemListJsonLd(name: string, items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${site.url}${it.path}`,
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Home page: the website and its front page. The company itself comes from the site layout. */
export function homeJsonLd(): Json[] {
  return [
    websiteJsonLd(),
    webPageJsonLd({
      path: "/",
      name: `${site.name} | BIM and Digital Twin, Chennai`,
      description: site.description,
      image: "/opengraph-image",
    }),
  ];
}

/**
 * Everything a plain page adds to the head: its breadcrumb trail, the page itself and,
 * optionally, a list of what it indexes.
 */
export function pageJsonLd({
  path,
  name,
  description,
  type = "WebPage",
  crumbs,
  list,
  extra = [],
}: {
  path: string;
  name: string;
  description: string;
  type?: PageType;
  crumbs: { name: string; path: string }[];
  list?: { name: string; items: { name: string; path: string }[] };
  extra?: Json[];
}): Json[] {
  return [
    breadcrumbJsonLd([{ name: "Home", path: "/" }, ...crumbs]),
    webPageJsonLd({ path, name, description, type }),
    ...(list ? [itemListJsonLd(list.name, list.items)] : []),
    ...extra,
  ];
}
