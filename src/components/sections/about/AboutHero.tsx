import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { Label, Overline, Stop } from "@/components/ui/Typography";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/**
 * About hero: a plain, large headline and the opening statement of who SBT is,
 * then a full-width view of the Riyadh skyline, the city where the group began.
 */
export function AboutHero() {
  return (
    <Section surface="paper" spacing={false} aria-labelledby="about-hero-title">
      <div className="container-x pt-[calc(var(--header-h)+2.5rem)] pb-12 lg:pt-[calc(var(--header-h)+4rem)] lg:pb-16">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
          className="text-slate-700"
        />

        <div className="grid-12 mt-10 gap-y-8 lg:mt-14">
          <Overline className="col-span-12 self-start text-slate-700 lg:col-span-3 lg:pt-4">
            About {site.shortName}
          </Overline>
          <h1
            id="about-hero-title"
            className="col-span-12 text-display lg:col-span-9"
          >
            The production firm behind landmark buildings
            <Stop />
          </h1>
          <p className="col-span-12 max-w-[52ch] text-lead text-slate-700 lg:col-span-6 lg:col-start-4">
            {site.name} is the production firm of {site.group}. From a newly
            opened production centre in Chennai, we deliver BIM, reality
            capture, digital twins and facility systems, on the experience of{" "}
            {projects.length} landmark projects.
          </p>
        </div>
      </div>

      <div className="container-x pb-14 lg:pb-20">
        <figure className="flex flex-col gap-3">
          <div className="relative aspect-[16/9] overflow-hidden bg-slate-200 lg:aspect-[21/9]">
            <Image
              src="/assets/misc/hero-architecture.webp"
              alt="The King Abdullah Financial District skyline in Riyadh at sunset"
              width={2400}
              height={1432}
              sizes="(min-width: 1680px) 1560px, 100vw"
              priority
              className="grade h-full w-full object-cover object-[50%_40%]"
            />
            <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
              Associated with {site.groupLabel}
            </span>
          </div>
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <Label className="text-slate-700">
              Fig. 01 · King Abdullah Financial District
            </Label>
            <Label className="text-slate-700">Riyadh, Saudi Arabia</Label>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
