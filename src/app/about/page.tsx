import type { Metadata } from "next";
import { AboutExperience } from "@/components/sections/about/AboutExperience";
import { AboutFaq } from "@/components/sections/about/AboutFaq";
import { AboutGroup } from "@/components/sections/about/AboutGroup";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutOffices } from "@/components/sections/about/AboutOffices";
import { AboutPrinciples } from "@/components/sections/about/AboutPrinciples";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { AboutWork } from "@/components/sections/about/AboutWork";
import { HomeCta } from "@/components/sections/home/HomeCta";
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
 * About: hero, our story, the group, vision and values, offices, the four
 * pathways, experience, FAQ, closing call to action (then the footer).
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
      <AboutGroup />
      <AboutPrinciples />
      <AboutOffices />
      <AboutWork />
      <AboutExperience />
      <AboutFaq />
      <HomeCta />
    </>
  );
}
