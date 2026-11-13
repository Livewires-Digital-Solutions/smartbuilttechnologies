import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HomeAbout } from "@/components/sections/home/HomeAbout";
import { HomeClients } from "@/components/sections/home/HomeClients";
import { HomeCta } from "@/components/sections/home/HomeCta";
import { HomeFaq } from "@/components/sections/home/HomeFaq";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeNews } from "@/components/sections/home/HomeNews";
import { HomeProjects } from "@/components/sections/home/HomeProjects";
import { HomeServices } from "@/components/sections/home/HomeServices";
import { HomeWhyBim } from "@/components/sections/home/HomeWhyBim";
import { homeJsonLd, JsonLd } from "@/lib/jsonld";

const title =
  "Smart Built Technologies | BIM and Digital Twin, Chennai";
const description =
  "Smart Built Technologies is the production firm of Technical Xperts Group (TXG) - Saudi Arabia. BIM, scan to BIM, digital twin and CAFM from Chennai.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/",
});

/**
 * Home: hero, clients, about, services, why choose us, iconic
 * projects, latest news, FAQ, closing call to action (then the footer).
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <div className="scroll-progress" aria-hidden="true" />
      <HomeHero />
      <HomeClients />
      <HomeAbout />
      <HomeServices />
      <HomeWhyBim />
      <HomeProjects />
      <HomeNews />
      <HomeFaq />
      <HomeCta />
    </>
  );
}
