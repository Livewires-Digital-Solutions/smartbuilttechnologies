import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactEnquiry } from "@/components/sections/contact/ContactEnquiry";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactOffices } from "@/components/sections/contact/ContactOffices";
import { site } from "@/content/site";
import { JsonLd, pageJsonLd } from "@/lib/jsonld";

const title =
  "Contact Us | Smart Built Technologies";
const description =
  "Start a BIM or digital construction project with Smart Built Technologies. Reach our Chennai production centre or the group offices in Riyadh and Sharjah.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/contact",
});

/**
 * Contact, built from the home page's moves: a split hero with the direct lines,
 * the enquiry form on the navy band with the invitation pinned beside it, and the
 * locations as an index of ruled rows.
 */
export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/contact",
          name: title,
          description,
          type: "ContactPage",
          crumbs: [{ name: "Contact Us", path: "/contact" }],
        })}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <ContactHero />
      <ContactEnquiry />
      <ContactOffices />
    </>
  );
}
