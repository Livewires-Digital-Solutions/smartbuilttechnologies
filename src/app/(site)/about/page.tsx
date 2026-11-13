import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AboutFaq } from "@/components/sections/about/AboutFaq";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutOffices } from "@/components/sections/about/AboutOffices";
import { AboutPrinciples } from "@/components/sections/about/AboutPrinciples";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { HomeProjects } from "@/components/sections/home/HomeProjects";
import { JsonLd, pageJsonLd } from "@/lib/jsonld";

const title =
  "About Smart Built Technologies, Production Firm of TXG";
const description =
  "Meet Smart Built Technologies, the production firm of Technical Xperts Group (TXG) - Saudi Arabia: our Chennai production centre, group offices and track record.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/about",
});

/**
 * About, built from the home page's own moves: a pinned hero that travels the
 * route from Riyadh to Chennai, a story rail, the navy values band, an index of
 * offices, the pinned projects filmstrip, FAQ and the closing call to action.
 */
export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={pageJsonLd({
          path: "/about",
          name: title,
          description,
          type: "AboutPage",
          crumbs: [{ name: "About", path: "/about" }],
        })}
      />
      <div className="scroll-progress" aria-hidden="true" />
      <AboutHero />
      <AboutStory />
      <AboutPrinciples />
      <AboutOffices />
      <HomeProjects index="04" />
      <AboutFaq />
      <HomeCta />
    </>
  );
}
