import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const blurb: Record<string, string> = {
  chennai: "Production centre: modelling, scanning, data and software.",
  riyadh: `Headquarters of ${site.groupLabel}, where the group began in ${site.foundedGroup}.`,
  sharjah: "Group office, supporting clients across the Gulf.",
};

/**
 * Where we work: an index like the services list on the home page. One ruled row
 * per place, the city set large, the role and address beside it.
 */
export function AboutOffices() {
  return (
    <Section surface="paper" aria-labelledby="offices-title" id="where">
      <div className="container-x">
        <SectionHead id="offices-title" index="03" label="Where we work">
          Production in Chennai, close to clients in the Gulf
        </SectionHead>

        <ul className="mt-12 border-t-[1.5px] border-t-navy lg:mt-16">
          {site.offices.map((o, i) => {
            const primary = "primary" in o && o.primary;
            const lines =
              o.id === "chennai"
                ? [`${o.city}, Tamil Nadu`, o.country]
                : o.address.slice(1);
            const Row = o.id === "chennai" ? "div" : "a";
            return (
              <li key={o.id} className="reveal border-b border-[var(--hairline)]">
                <Row
                  {...(o.id === "chennai"
                    ? {}
                    : {
                        href: o.mapUrl,
                        target: "_blank",
                        rel: "noreferrer",
                        "aria-label": `${o.city}, view on map`,
                      })}
                  className="group grid grid-cols-12 items-center gap-x-6 gap-y-3 py-7 transition-colors hover:bg-white lg:py-10"
                >
                  <span className="col-span-2 font-mono text-overline text-slate-500 lg:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-10 flex items-center gap-4 lg:col-span-5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-3 shrink-0 rounded-[3px] transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:scale-[1.4]",
                        primary ? "bg-orange" : "bg-navy",
                      )}
                    />
                    <span className="text-[clamp(2.5rem,1.4rem+3.6vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.055em] transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1">
                      {o.city}
                    </span>
                  </span>
                  <span className="col-span-12 flex flex-col gap-1.5 lg:col-span-6">
                    <Label className="text-slate-700">{o.role}</Label>
                    <span className="max-w-[48ch] text-lead text-navy">
                      {blurb[o.id]}
                    </span>
                    <span className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                      <span className="flex flex-col text-slate-700">
                        {lines.map((l) => (
                          <span key={l}>{l}</span>
                        ))}
                      </span>
                      {o.id !== "chennai" ? (
                        <span className="inline-flex items-center gap-2 font-semibold text-navy">
                          <span className="underline underline-offset-[6px]">
                            View on map
                          </span>
                          <Icon
                            name="arrow-up-right"
                            size={16}
                            className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                      ) : null}
                    </span>
                  </span>
                </Row>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
