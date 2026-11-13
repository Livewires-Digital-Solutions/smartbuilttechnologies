import type { Metadata } from "next";
import { HomeProjects } from "@/components/sections/home/HomeProjects";
import { ServiceCta } from "@/components/sections/services/ServiceCta";
import { ServiceDeliver } from "@/components/sections/services/ServiceDeliver";
import { ServiceFaq } from "@/components/sections/services/ServiceFaq";
import { ServiceHero } from "@/components/sections/services/ServiceHero";
import { ServiceNext } from "@/components/sections/services/ServiceNext";
import { ServiceTagging } from "@/components/sections/services/ServiceTagging";
import { ServiceWhat } from "@/components/sections/services/ServiceWhat";
import { ServiceWhy } from "@/components/sections/services/ServiceWhy";
import { serviceDocs } from "@/content/service-pages";
import type { ServiceSlug } from "@/content/services";
import { site } from "@/content/site";
import { JsonLd, pageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

/** Search metadata for one service page. */
export function serviceMetadata(slug: ServiceSlug): Metadata {
  const doc = serviceDocs[slug];
  return pageMetadata({
    title: `${doc.seoTitle} | ${site.name}`,
    description: doc.seoDescription,
    path: `/services/${slug}`,
    image: doc.image
      ? { src: doc.image.src, alt: doc.image.alt, width: doc.image.width, height: doc.image.height }
      : null,
  });
}

/**
 * One service, in the home page's design language: split hero, the definition
 * beside a real project, the navy "why choose us" band, ruled rows of what we
 * deliver, the projects filmstrip, the next service and a closing call to action.
 * Each service has its own route file that renders this, so the pages are plain
 * static routes with no params to wait for.
 */
export function ServiceView({ slug }: { slug: ServiceSlug }) {
  const doc = serviceDocs[slug];

  // 01 is "What is…", 02 the "why" band when the service has one; the rest follow.
  let n = doc.why.items.length ? 2 : 1;
  const num = () => String(++n).padStart(2, "0");
  const deliver = num();
  const tagging = slug === "asset-management" ? num() : "";
  const faq = doc.faqs ? num() : "";
  const projects = num();

  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: `/services/${slug}`,
          name: doc.crumb,
          description: doc.seoDescription,
          crumbs: [
            { name: "Services", path: "/services" },
            { name: doc.crumb, path: `/services/${slug}` },
          ],
          extra: [
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "@id": `${site.url}/services/${slug}#service`,
              name: doc.crumb,
              serviceType: doc.crumb,
              description: doc.seoDescription,
              url: `${site.url}/services/${slug}`,
              image: doc.image ? `${site.url}${doc.image.src}` : undefined,
              provider: { "@id": `${site.url}/#organization` },
              areaServed: ["Saudi Arabia", "United Arab Emirates", "India"].map(
                (name) => ({ "@type": "Country", name }),
              ),
              mainEntityOfPage: { "@id": `${site.url}/services/${slug}#webpage` },
            },
          ],
        })}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <ServiceHero doc={doc} />
      <ServiceWhat doc={doc} />
      <ServiceWhy doc={doc} />
      <ServiceDeliver doc={doc} index={deliver} />
      {tagging ? <ServiceTagging index={tagging} /> : null}
      {doc.faqs ? <ServiceFaq index={faq} faqs={doc.faqs} /> : null}
      <HomeProjects index={projects} />
      <ServiceNext slug={slug} />
      <ServiceCta doc={doc} />
    </>
  );
}
