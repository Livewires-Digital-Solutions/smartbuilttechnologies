import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { site } from "@/content/site";

/**
 * Our story: how the group began, and what the production firm is for. Copy
 * follows the client's messaging brief (11 Nov 2026): SBT is the production firm
 * of TXG, carries its record, and the Chennai centre is newly opened.
 */
export function AboutStory() {
  return (
    <Section surface="paper" aria-labelledby="story-title" className="pt-0">
      <div className="container-x">
        <div className="border-t border-[var(--hairline)] pt-14 lg:pt-20">
          <SectionHead id="story-title" index="01" label="Our story">
            A group with a record, and a new centre built to extend it
          </SectionHead>
        </div>

        <div className="grid-12 mt-12 items-start gap-y-12 lg:mt-16">
          <div className="reveal col-span-12 flex flex-col gap-6 lg:col-span-5 lg:col-start-4">
            <p className="text-lead text-slate-700">
              {site.group} was founded in Riyadh in {site.foundedGroup}. Since
              then it has built its record on BIM and digital delivery for
              landmark projects in Saudi Arabia and Australia, among them the
              King Abdullah Financial District, Jeddah Tower and NEOM Bay
              Airport.
            </p>
            <p className="text-lead text-slate-700">
              {site.name} is its production firm. Our production centre in
              Chennai opened to meet growing demand, and it works under the TXG
              name. The experience, standards and track record behind every
              project are the group’s, and so are ours.
            </p>
            <p className="text-lead text-slate-700">
              Group teams in Riyadh and Sharjah work with clients in the Gulf,
              while modelling, scanning, data and software production runs from
              Chennai.
            </p>
          </div>

          <figure className="reveal col-span-12 flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
              <Image
                src="/assets/misc/team-at-work.jpg"
                alt="A hand holding a building model over architectural drawings"
                width={1040}
                height={660}
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="grade h-full w-full object-cover object-[62%_50%]"
              />
            </div>
            <figcaption>
              <Label className="text-slate-700">
                Fig. 02 · From drawing to model
              </Label>
            </figcaption>
          </figure>
        </div>

        <blockquote className="reveal mt-16 border-l-[3px] border-orange pl-6 lg:mt-24 lg:pl-10">
          <p className="quote max-w-[24ch] text-statement text-navy">
            One model, from first sketch to facility handover.
          </p>
        </blockquote>
      </div>
    </Section>
  );
}
