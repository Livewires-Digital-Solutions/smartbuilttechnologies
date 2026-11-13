import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Label, Stop } from "@/components/ui/Typography";

const links: [string, string, string][] = [
  ["Services", "/services", "BIM, scan to BIM, digital twin and more"],
  ["Projects", "/projects", "Landmark projects we have worked on"],
  ["Blog", "/blog", "Articles and company news"],
  ["Careers", "/careers", "Open positions and how to apply"],
  ["Contact", "/contact", "Start a project or ask a question"],
];

/** A page that does not exist: says so plainly and offers the main ways on. */
export function NotFoundView() {
  return (
    <Section
      surface="paper"
      spacing={false}
      aria-labelledby="not-found-title"
      className="pt-[var(--header-h)]"
    >
      <div className="container-x pb-20">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
          <Label>Smart Built Technologies · 404</Label>
        </div>
        <div className="grid-12 gap-y-10 py-12 lg:py-20">
          <div className="col-span-12 flex flex-col gap-5 lg:col-span-6">
            <h1
              id="not-found-title"
              className="text-[clamp(2.75rem,min(6.3vw,10svh),6.5rem)] leading-[0.93] font-medium tracking-[-0.06em]"
            >
              <span className="hero-line" style={{ "--i": 0 } as CSSProperties}>
                <span>Page not</span>
              </span>
              <span className="hero-line" style={{ "--i": 1 } as CSSProperties}>
                <span>
                  found
                  <Stop />
                </span>
              </span>
            </h1>
            <p className="max-w-[44ch] text-[1.0625rem] leading-snug text-slate-700">
              The page you were looking for may have moved, or the address may
              have a typing mistake. These are the places most people want.
            </p>
            <div>
              <Link
                href="/"
                className="group inline-flex min-h-11 items-center gap-2 font-semibold text-navy"
              >
                <Icon name="arrow-left" size={16} />
                <span className="underline underline-offset-[6px]">
                  Back to the home page
                </span>
              </Link>
            </div>
          </div>
          <ul className="col-span-12 border-t-[1.5px] border-t-navy lg:col-span-5 lg:col-start-8">
            {links.map(([label, href, note]) => (
              <li key={href} className="border-b border-[var(--hairline)]">
                <Link
                  href={href}
                  className="group flex min-h-11 items-baseline justify-between gap-4 py-4 hover:bg-white"
                >
                  <span className="text-[1.375rem] leading-none font-medium tracking-[-0.03em]">
                    {label}
                  </span>
                  <span className="text-right text-[0.875rem] text-slate-700">
                    {note}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
