import type { Metadata } from "next";
import { HomeAbout } from "@/components/sections/home/HomeAbout";
import { HomeAccreditations } from "@/components/sections/home/HomeAccreditations";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { HomeFaq } from "@/components/sections/home/HomeFaq";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeNews } from "@/components/sections/home/HomeNews";
import { HomePartners } from "@/components/sections/home/HomePartners";
import { HomeProjects } from "@/components/sections/home/HomeProjects";
import { HomeServices } from "@/components/sections/home/HomeServices";
import { HomeWhyBim } from "@/components/sections/home/HomeWhyBim";
import { homeJsonLd, JsonLd } from "@/lib/jsonld";

const title = "BIM & Scan to BIM Services in Chennai | Smart Built Technologies";
const description =
  "Smart Built Technologies, the production hub of TXG KSA, delivers BIM modelling, scan to BIM, digital twins and CAFM from Chennai for projects worldwide.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/**
 * Home: hero, technology partners, about, accreditations, services, why choose us, iconic
 * projects, latest news, FAQ, closing call to action (then the footer).
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <div className="scroll-progress" aria-hidden="true" />
      <HomeHero />
      <HomePartners />
      <HomeAbout />
      <HomeAccreditations />
      <HomeServices />
      <HomeWhyBim />
      <HomeProjects />
      <HomeNews />
      <HomeFaq />
      <HomeCta />
    </>
  );
}
