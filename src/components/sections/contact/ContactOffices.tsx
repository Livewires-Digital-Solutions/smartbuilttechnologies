import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** The group's own contact address for the Riyadh and Sharjah offices (txgksa.com/contact). */
const GROUP_EMAIL = "info@txgksa.com";

/** Name, address lines and email for each place, as txgksa.com/contact lists them (Chennai is ours). */
const places = [
  {
    id: "chennai",
    name: "India",
    role: "Production centre",
    lines: ["Smart Built Technologies", "Chennai, Tamil Nadu", "India"],
    email: site.contact.email,
  },
  {
    id: "riyadh",
    name: "KSA",
    role: "Head Quarters",
    lines: ["Al Kindi Plaza, Diplomatic Quarter,", "Riyadh, KSA"],
    email: GROUP_EMAIL,
  },
  {
    id: "sharjah",
    name: "UAE",
    role: "Group office",
    lines: [
      "Technical Xperts Group",
      "SAIF-Zone",
      "PO BOX - 513153",
      "Sharjah, UAE",
    ],
    email: GROUP_EMAIL,
  },
];

/** "Global Presence · Our Locations": one ruled row per office, with address, email and a map link. */
export function ContactOffices() {
  return (
    <Section surface="paper" id="locations" aria-labelledby="locations-title">
      <div className="container-x">
        <SectionHead id="locations-title" index="02" label="Global Presence">
          Our Locations.
        </SectionHead>

        <ul className="mt-12 border-t-[1.5px] border-t-navy lg:mt-16">
          {places.map((p, i) => {
            const office = site.offices.find((o) => o.id === p.id)!;
            return (
              <li
                key={p.id}
                className="reveal border-b border-[var(--hairline)]"
              >
                <div className="group grid grid-cols-12 items-start gap-x-6 gap-y-4 py-7 transition-colors hover:bg-white lg:py-10">
                  <span className="col-span-2 pt-3 font-mono text-overline text-slate-500 lg:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-10 flex flex-col gap-2 lg:col-span-5">
                    <span className="flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-3 shrink-0 rounded-[3px] transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:scale-[1.4]",
                          p.id === "chennai" ? "bg-orange" : "bg-navy",
                        )}
                      />
                      <span className="text-[clamp(2.5rem,1.4rem+3.6vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.055em]">
                        {p.name}
                      </span>
                    </span>
                    <Label className="pl-7 text-slate-700">{p.role}</Label>
                  </span>
                  <span className="col-span-12 flex flex-col gap-3 lg:col-span-6">
                    <span className="flex flex-col text-lead text-navy">
                      {p.lines.map((l) => (
                        <span key={l}>{l}</span>
                      ))}
                    </span>
                    <span className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                      <a
                        href={`mailto:${p.email}`}
                        className="font-semibold text-navy underline underline-offset-[5px]"
                      >
                        {p.email}
                      </a>
                      <a
                        href={office.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 font-semibold text-navy"
                      >
                        <span className="underline underline-offset-[6px]">
                          View on Map
                        </span>
                        <Icon
                          name="arrow-up-right"
                          size={16}
                          className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
