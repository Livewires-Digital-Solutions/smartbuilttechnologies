import type { Metadata } from "next";
import { PrivacyView } from "@/components/sections/privacy/PrivacyView";
import { JsonLd, pageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

const title = "Privacy Notice | Smart Built Technologies";
const description =
  "How Smart Built Technologies handles personal data from job applications and enquiries: what we collect, who sees it, how long we keep it and your rights.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/privacy",
          name: title,
          description,
          crumbs: [{ name: "Privacy", path: "/privacy" }],
        })}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <PrivacyView />
    </>
  );
}
