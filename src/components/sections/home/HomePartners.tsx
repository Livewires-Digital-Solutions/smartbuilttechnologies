import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Overline } from "@/components/ui/Typography";
import { partners } from "@/content/credentials";

/**
 * Technology partners. A calm, ruled strip: logos sit still (no marquee, so each
 * one is read once by screen readers) and return to full colour on hover.
 */
export function HomePartners() {
  return (
    <Section
      surface="white"
      spacing={false}
      aria-labelledby="partners-title"
      className="py-12 lg:py-16"
    >
      <div className="container-x">
        <div className="grid-12 items-start gap-y-4">
          <Overline
            as="h2"
            id="partners-title"
            index="01"
            className="col-span-12 text-slate-700 lg:col-span-3"
          >
            Technology partners
          </Overline>
          <p className="col-span-12 max-w-[52ch] text-slate-700 lg:col-span-6 lg:col-start-4">
            The design, capture, GIS, facility and immersive platforms our
            clients already run on, and that we work in every day.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-2 border-t border-b border-[var(--hairline)] sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {partners.map((p) => (
            <li
              key={p.name}
              className="flex h-24 items-center justify-center px-6 lg:h-28"
            >
              <Image
                src={p.src}
                alt={p.name}
                width={600}
                height={300}
                sizes="(min-width: 1280px) 160px, 40vw"
                className="h-14 w-auto max-w-full object-contain opacity-90 grayscale contrast-[1.6] brightness-[0.92] transition-[opacity,filter] duration-[var(--duration-ui)] ease-[var(--ease-out)] hover:opacity-100 hover:grayscale-0 hover:contrast-100 hover:brightness-100 lg:h-16"
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
