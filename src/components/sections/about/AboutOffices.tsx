import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** Where we work: the production centre first, then the group offices. */
export function AboutOffices() {
  return (
    <Section surface="paper" aria-labelledby="offices-title">
      <div className="container-x">
        <SectionHead id="offices-title" index="04" label="Where we work">
          Production in Chennai, close to clients in the Gulf
        </SectionHead>

        <ul className="reveal mt-12 grid border-t-[1.5px] border-t-navy lg:mt-16 lg:grid-cols-3">
          {site.offices.map((o, i) => {
            const primary = "primary" in o && o.primary;
            return (
              <li
                key={o.id}
                className={cn(
                  "flex flex-col gap-4 border-b border-[var(--hairline)] py-8 lg:border-b-0 lg:py-10 lg:pr-10",
                  i > 0 && "lg:border-l lg:pl-10",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-[11px] rounded-[3px]",
                      primary ? "bg-orange" : "bg-navy",
                    )}
                  />
                  <Label className="text-slate-700">{o.role}</Label>
                </span>
                <h3 className="text-h1">{o.city}</h3>
                <address className="flex flex-col text-slate-700 not-italic">
                  {o.id === "chennai"
                    ? [`${o.city}, Tamil Nadu`, o.country].map((l) => (
                        <span key={l}>{l}</span>
                      ))
                    : o.address.slice(1).map((l) => <span key={l}>{l}</span>)}
                </address>
                {o.id !== "chennai" ? (
                  <a
                    href={o.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 self-start font-semibold text-navy"
                  >
                    <span className="underline underline-offset-[6px]">
                      View on map
                    </span>
                    <Icon
                      name="arrow-up-right"
                      size={16}
                      className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
