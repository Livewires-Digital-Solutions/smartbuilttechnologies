import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { accreditations } from "@/content/credentials";
import { site } from "@/content/site";

/**
 * Accreditations. The certificates themselves are the visual: real documents, set
 * on a paper tray with a register line under each. Only the four published ISO
 * certificates are shown (PLAN.md §1 #5). The two issued in Riyadh are Technical Xperts Group (TXG) - Saudi Arabia's own
 * and are tagged; the two issued in Kerala name a different company, so no claim is
 * made about them beyond showing them as issued.
 */
export function HomeAccreditations() {
  return (
    <Section surface="white" aria-labelledby="accred-title">
      <div className="container-x">
        <SectionHead
          id="accred-title"
          index="03"
          label="Standards and governance"
          aside={
            <p className="max-w-[56ch] text-lead text-slate-700">
              Independent certification of the management systems behind our
              work: quality, environment, health and safety, and information
              security. Each certificate is shown as issued.
            </p>
          }
        >
          Certified to international standards
        </SectionHead>

        <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {accreditations.map((a, i) => (
            <li key={a.id} className="reveal">
              <figure className="group flex flex-col gap-4">
                <div className="bg-paper border border-[var(--hairline)] p-4 transition-[translate,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:shadow-[0_24px_40px_-28px_rgb(12_20_70/0.45)] lg:p-5">
                  {a.image ? (
                    <Image
                      src={a.image.src}
                      alt={`${a.title} certificate`}
                      width={a.image.width}
                      height={a.image.height}
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 90vw"
                      className="aspect-[0.7] h-auto w-full bg-white object-contain"
                    />
                  ) : null}
                </div>
                <figcaption className="flex flex-col gap-1.5">
                  <Label className="text-slate-700">
                    Cert. {String(i + 1).padStart(2, "0")} · {a.scope}
                  </Label>
                  <span className="text-[1.125rem] font-medium tracking-[-0.02em]">
                    {a.title}
                  </span>
                  <span className="max-w-[34ch] text-[0.875rem] leading-snug text-slate-700">
                    {a.standard}
                  </span>
                  {a.heldByKsa ? (
                    <span className="mt-1 w-fit border border-navy px-2 py-0.5">
                      <Label>Held by {site.group}</Label>
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] pt-5">
          <Label className="text-slate-700">
            Four certificates on file · more accreditations on the About page
          </Label>
          <Link
            href="/about#accreditations"
            className="group inline-flex items-center gap-2 font-semibold"
          >
            <span className="underline underline-offset-[6px]">
              Explore the full repository
            </span>
            <Icon
              name="arrow-right"
              size={16}
              className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Section>
  );
}
