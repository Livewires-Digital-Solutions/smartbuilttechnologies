import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/ui/CountUp";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Label, Overline } from "@/components/ui/Typography";
import { clients, partners } from "@/content/credentials";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/** "RSG" is held back until TXG confirms it is a separate client (see credentials.ts). */
const shown = clients.filter((c) => c.name !== "RSG");

/**
 * Right after the hero: proof. The clients behind the Technical Xperts Group (TXG) - Saudi Arabia track record, as a
 * ruled wall of real logos (grey at rest, colour on hover, name on hover), with the
 * count beside it. The software platforms we work in sit underneath, quieter.
 */
export function HomeClients() {
  return (
    <Section
      surface="white"
      spacing={false}
      aria-labelledby="clients-title"
      className="py-16 lg:py-24"
    >
      <div className="container-x">
        <div className="grid-12 items-start gap-y-10">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:pr-6">
            <Overline index="01" className="text-slate-700">
              Clients
            </Overline>
            <h2 id="clients-title" className="text-h1">
              The clients behind the track record
            </h2>
            <p className="max-w-[40ch] text-lead text-slate-700">
              {site.name} carries the experience of {site.groupLabel}, which has
              worked with the developers, contractors and owners behind the
              Gulf’s most ambitious buildings.
            </p>
            <dl className="mt-2 flex items-end gap-10 border-t-[1.5px] border-t-navy pt-5">
              <div className="flex flex-col gap-1.5">
                <dd className="order-1 text-[clamp(3.25rem,2rem+4vw,5.5rem)] leading-[0.9] font-medium tracking-[-0.06em] tabular-nums">
                  <CountUp to={shown.length} />
                </dd>
                <dt className="order-2">
                  <Label>Clients</Label>
                </dt>
              </div>
              <div className="flex flex-col gap-1.5">
                <dd className="order-1 text-[clamp(3.25rem,2rem+4vw,5.5rem)] leading-[0.9] font-medium tracking-[-0.06em] tabular-nums">
                  <CountUp to={projects.length} />
                </dd>
                <dt className="order-2">
                  <Label>Projects</Label>
                </dt>
              </div>
            </dl>
          </div>

          <ul className="col-span-12 grid grid-cols-2 border-t-[1.5px] border-t-navy sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
            {shown.map((c, i) => (
              <li
                key={c.name}
                className="reveal group relative flex h-28 items-center justify-center border-b border-l border-[var(--hairline)] px-5 max-sm:odd:border-l-0 sm:max-lg:nth-[3n+1]:border-l-0 lg:nth-[4n+1]:border-l-0 lg:h-32"
                style={
                  {
                    "--reveal-delay": `${(i % 4) * 70}ms`,
                  } as React.CSSProperties
                }
              >
                <Image
                  src={c.src}
                  alt={c.name}
                  width={328}
                  height={160}
                  sizes="(min-width: 1024px) 14vw, 40vw"
                  className="h-14 w-full object-contain opacity-90 grayscale contrast-125 transition-[opacity,filter,translate] duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:-translate-y-2 group-hover:opacity-100 group-hover:grayscale-0 group-hover:contrast-100 lg:h-[4.25rem]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2.5 left-0 w-full px-3 text-center font-mono text-[0.625rem] leading-tight tracking-[0.06em] text-slate-700 uppercase opacity-0 transition-opacity duration-[var(--duration-ui)] group-hover:opacity-100"
                >
                  {c.name}
                </span>
              </li>
            ))}
            <li className="reveal flex h-28 border-b border-l border-[var(--hairline)] lg:h-32">
              <Link
                href="/projects"
                className="group flex w-full flex-col justify-center gap-1.5 px-5 transition-colors hover:bg-navy hover:text-white"
              >
                <Label className="text-inherit opacity-70">
                  Associated with TXG
                </Label>
                <span className="inline-flex items-center gap-2 font-semibold">
                  <span className="underline underline-offset-[5px]">
                    See the projects
                  </span>
                  <Icon
                    name="arrow-right"
                    size={16}
                    className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-[var(--hairline)] pt-6 lg:mt-16 lg:flex-row lg:items-center lg:gap-10">
          <Label className="shrink-0 text-slate-700 lg:w-[16rem]">
            Working in the platforms they run on
          </Label>
          <ul className="flex flex-wrap items-center gap-x-9 gap-y-4">
            {partners.map((p) => (
              <li key={p.name}>
                <Image
                  src={p.src}
                  alt={p.name}
                  width={600}
                  height={300}
                  sizes="120px"
                  className="h-7 w-auto max-w-[7.5rem] object-contain opacity-80 grayscale contrast-[1.5] transition-[opacity,filter] duration-[var(--duration-ui)] ease-[var(--ease-out)] hover:opacity-100 hover:grayscale-0 hover:contrast-100"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
