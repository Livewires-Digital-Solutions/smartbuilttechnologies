import { CountUp } from "@/components/ui/CountUp";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const countries = new Set(projects.map((p) => p.country)).size;

/** The group, oldest first. The last stop is where Smart Built Technologies works. */
const stops = [
  {
    when: String(site.foundedGroup),
    where: "Riyadh",
    text: `${site.groupLabel} is founded and builds its record on landmark projects in the Gulf and Australia.`,
  },
  {
    when: "Group",
    where: "Sharjah",
    text: "A group office in the UAE supports projects for clients across the Gulf.",
  },
  {
    when: "Now",
    where: "Chennai",
    text: `${site.name} opens as the production firm of ${site.groupLabel}: modelling, scanning, data and software.`,
    current: true,
  },
];

const figures: { n: number; suffix?: string; label: string; note: string }[] = [
  {
    n: 250,
    suffix: "+",
    label: "Professionals",
    note: `At ${site.groupLabel}`,
  },
  {
    n: projects.length,
    label: "Landmark projects",
    note: `Associated with ${site.groupLabel}`,
  },
  { n: countries, label: "Countries", note: "Saudi Arabia and Australia" },
  { n: site.offices.length, label: "Offices", note: "Riyadh, Sharjah, Chennai" },
];

/** The group: a three-stop line from Riyadh to Chennai, then four counted figures. */
export function AboutGroup() {
  return (
    <Section surface="navy" aria-labelledby="group-title">
      <div className="container-x">
        <SectionHead
          id="group-title"
          index="02"
          label="The group"
          tone="dark"
        >
          From Riyadh to Chennai
          <span className="text-orange">.</span>
        </SectionHead>

        <ol className="reveal mt-14 grid gap-10 lg:mt-20 lg:grid-cols-3 lg:gap-0">
          {stops.map((s, i) => (
            <li
              key={s.where}
              className={cn(
                "relative flex flex-col gap-3 lg:pr-10",
                i > 0 && "lg:pl-10",
              )}
            >
              <div className="relative flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 size-[15px] shrink-0 rounded-[4px]",
                    s.current ? "bg-orange" : "bg-white",
                  )}
                />
                {i < stops.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="hidden h-px flex-1 bg-white/25 lg:block"
                  />
                ) : null}
              </div>
              <Label className={s.current ? "text-white" : "text-white/70"}>
                {s.when}
              </Label>
              <p className="text-h2">{s.where}</p>
              <p className="max-w-[40ch] text-white/75">{s.text}</p>
            </li>
          ))}
        </ol>

        <dl className="reveal mt-16 grid grid-cols-2 border-t border-t-white/30 lg:mt-24 lg:grid-cols-4">
          {figures.map((f, i) => (
            <div
              key={f.label}
              className={cn(
                "flex flex-col gap-2 border-b border-white/15 py-6 pr-4 lg:border-b-0 lg:py-8",
                i > 0 && "lg:border-l lg:border-white/15 lg:pl-8",
                i % 2 === 1 && "pl-4 max-lg:border-l max-lg:border-white/15",
              )}
            >
              <dt className="order-2 mt-2">
                <Label className="text-white/70">{f.label}</Label>
              </dt>
              <dd className="order-1 text-[clamp(3.25rem,2rem+4.6vw,6.25rem)] leading-[0.9] font-medium tracking-[-0.06em] tabular-nums">
                <CountUp to={f.n} suffix={f.suffix} />
              </dd>
              <dd className="order-3 text-[0.875rem] text-white/70">
                {f.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
