import type { Metadata } from "next";
import { ContactEnquiry } from "@/components/sections/contact/ContactEnquiry";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactOffices } from "@/components/sections/contact/ContactOffices";
import { site } from "@/content/site";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

const title =
  "Contact Us | Smart Built Technologies, Production Firm of TXG, KSA";
const description =
  "Get in touch with Smart Built Technologies, the production firm of Technical Xperts Group (TXG) - Saudi Arabia. Reach our Chennai production centre or the group offices in Riyadh and Sharjah, and start your BIM or digital construction project today.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/**
 * Contact, built from the home page's moves: a split hero with the direct lines,
 * the enquiry form on the navy band with the invitation pinned beside it, and the
 * locations as an index of ruled rows.
 */
export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact Us", path: "/contact" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Us",
            url: `${site.url}/contact`,
            about: { "@id": `${site.url}/#organization` },
          },
        ]}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <ContactHero />
      <ContactEnquiry />
      <ContactOffices />
    </>
  );
}
