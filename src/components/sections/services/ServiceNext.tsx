import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Label } from "@/components/ui/Typography";
import { servicesIndexCopy } from "@/content/service-pages";
import { services, type ServiceSlug } from "@/content/services";

/** The next service in the list, so the section reads like a book. */
export function ServiceNext({ slug }: { slug: ServiceSlug }) {
  const i = services.findIndex((s) => s.slug === slug);
  const next = services[(i + 1) % services.length]!;
  const copy = servicesIndexCopy.cards[next.slug];
  return (
    <Section surface="paper" spacing={false} aria-label="Next service">
      <div className="container-x">
        <Link
          href={`/services/${next.slug}`}
          className="group grid grid-cols-12 items-center gap-x-6 gap-y-3 border-t-[1.5px] border-t-navy py-10 lg:py-14"
        >
          <Label className="col-span-12 text-slate-700 lg:col-span-3">
            Next service · {String(((i + 1) % services.length) + 1).padStart(2, "0")}
          </Label>
          <span className="col-span-10 text-[clamp(1.875rem,1.2rem+2.6vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.045em] text-balance transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1.5 lg:col-span-8">
            {next.title}
          </span>
          <Icon
            name="arrow-right"
            size={28}
            className="col-span-2 justify-self-end text-slate-500 transition-[translate,color] duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-navy lg:col-span-1"
          />
          <span className="col-span-12 max-w-[56ch] text-slate-700 lg:col-span-8 lg:col-start-4">
            {copy.body}
          </span>
        </Link>
      </div>
    </Section>
  );
}
