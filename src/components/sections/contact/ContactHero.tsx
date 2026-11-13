import Image from "next/image";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";
import { site } from "@/content/site";

const HEADLINE = ["Get in", "Touch"];

/**
 * Contact hero, the home hero's split: the headline and lede on the left with the
 * direct lines as a ruled list, a photograph on the right.
 */
export function ContactHero() {
  const lines: [string, React.ReactNode][] = [
    [
      "Write",
      <a
        key="e"
        href={`mailto:${site.contact.email}`}
        className="underline-offset-[5px] hover:underline"
      >
        {site.contact.email}
      </a>,
    ],
    [
      "Call",
      <a
        key="p"
        href={site.contact.phoneHref}
        className="tabular underline-offset-[5px] hover:underline"
      >
        {site.contact.phone}
      </a>,
    ],
    ["Hours", site.contact.hours],
    ["Reply", `Within ${site.contact.replyTime}`],
  ];

  return (
    <Section
      surface="paper"
      spacing={false}
      aria-labelledby="contact-title"
      className="pt-[var(--header-h)] lg:flex lg:min-h-[min(100svh,880px)] lg:flex-col"
    >
      <div className="container-x flex w-full flex-1 flex-col pb-10 lg:pb-12">
        <div className="grid-12 flex-1 items-stretch gap-y-8">
          <div className="relative z-10 col-span-12 flex flex-col lg:col-span-7 lg:pr-10">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
              <Label>Smart Built Technologies · Contact</Label>
              <Label className="text-slate-700">
                Chennai · Riyadh · Sharjah
              </Label>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-[clamp(1rem,2.4svh,1.5rem)] py-8">
              <Breadcrumbs
                className="text-slate-700"
                items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
              />
              <h1
                id="contact-title"
                className="text-[clamp(2.75rem,min(6.3vw,10svh),7rem)] leading-[0.93] font-medium tracking-[-0.06em]"
              >
                {HEADLINE.map((line, i) => (
                  <span
                    key={line}
                    className="hero-line"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <span>
                      {line}
                      {i === HEADLINE.length - 1 ? <Stop /> : " "}
                    </span>
                  </span>
                ))}
              </h1>

              <p className="max-w-[50ch] text-[1.0625rem] leading-snug text-slate-700">
                We operate globally from our headquarters in KSA and key offices
                in UAE and India. Connect with us to shape the future of digital
                construction.
              </p>

              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                <ButtonLink href="#enquiry" variant="signal" icon="arrow-down">
                  Send a Message
                </ButtonLink>
                <ButtonLink
                  href="#locations"
                  variant="ghost"
                  className="underline"
                >
                  Our Locations
                </ButtonLink>
              </div>

              <dl className="mt-1 border-t-[1.5px] border-t-navy">
                {lines.map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-[5rem_1fr] gap-4 border-b border-[var(--hairline)] py-3"
                  >
                    <dt className="pt-1">
                      <Label className="text-slate-700">{k}</Label>
                    </dt>
                    <dd className="text-[1.0625rem] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <figure className="relative col-span-12 flex flex-col lg:col-span-5">
            <div className="hidden items-center justify-end border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5 lg:flex">
              <Label className="text-slate-700">
                The production firm of TXG, KSA
              </Label>
            </div>
            <div className="relative min-h-[320px] flex-1 overflow-hidden bg-slate-200 max-lg:aspect-[4/3] lg:mt-4">
              <Image
                src="/assets/misc/team-at-work.jpg"
                alt="A hand holding a building model over architectural drawings"
                width={1040}
                height={660}
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
                className="grade absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: "62% 50%" }}
              />
              <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                Collaborate With Us
              </span>
            </div>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
              <Label className="text-slate-700">
                Fig. 01 · From drawing to model
              </Label>
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
