import type { Metadata } from "next";
import { AboutFaq } from "@/components/sections/about/AboutFaq";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutOffices } from "@/components/sections/about/AboutOffices";
import { AboutPrinciples } from "@/components/sections/about/AboutPrinciples";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { HomeProjects } from "@/components/sections/home/HomeProjects";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";

const title = "About Us | Smart Built Technologies, Production Firm of TXG, KSA";
const description =
  "Smart Built Technologies is the production firm of Technical Xperts Group (TXG) - Saudi Arabia. Meet the group, its Chennai production centre, its offices and the landmark projects behind our BIM and digital delivery.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/**
 * About, built from the home page's own moves: a pinned hero that travels the
 * route from Riyadh to Chennai, a story rail, the navy values band, an index of
 * offices, the pinned projects filmstrip, FAQ and the closing call to action.
 */
export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
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
