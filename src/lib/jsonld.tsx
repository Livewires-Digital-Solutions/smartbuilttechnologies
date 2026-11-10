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

export function organizationJsonLd(): Json {
  const head = site.offices.find((o) => o.primary);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    slogan: site.tagline,
    description: site.description,
    email: site.contact.email,
    parentOrganization: {
      "@type": "Organization",
      name: site.group,
      alternateName: site.groupShort,
      url: site.groupUrl,
      foundingDate: String(site.foundedGroup),
    },
    address: head
      ? {
          "@type": "PostalAddress",
          addressLocality: head.city,
          addressRegion: "Tamil Nadu",
          addressCountry: "IN",
        }
      : undefined,
    sameAs: site.socials.map((s) => s.href),
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
