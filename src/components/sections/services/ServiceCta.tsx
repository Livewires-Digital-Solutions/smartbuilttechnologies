import { SymbolCrop } from "@/components/brand/Symbol";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Typography";
import type { ServiceDoc } from "@/content/service-pages";
import { site } from "@/content/site";

/** The closing call to action, in the service's own words, on the home page's pale cobalt field. */
export function ServiceCta({ doc }: { doc: ServiceDoc }) {
  return (
    <section
      aria-labelledby="service-cta-title"
      data-surface="light"
      className="relative overflow-hidden bg-cobalt-10 text-navy [--hairline:rgb(12_20_70/0.18)]"
    >
      <SymbolCrop
        tone="ghost-navy"
        className="absolute -right-[10%] -bottom-[22%] w-[min(66vw,900px)]"
      />
      <div className="container-x section-y relative">
        <div className="flex items-center justify-between gap-6 border-t border-t-navy pt-3">
          <Label>{doc.cta.label}</Label>
          <Label className="hidden text-slate-700 sm:block">
            Reply within {site.contact.replyTime}
          </Label>
        </div>

        <h2
          id="service-cta-title"
          className="reveal mt-12 max-w-[18ch] text-[clamp(2.25rem,1.2rem+4.6vw,5.5rem)] leading-[0.98] font-medium tracking-[-0.05em] text-balance lg:mt-16"
        >
          {doc.cta.title}
        </h2>

        <div className="grid-12 mt-10 gap-y-8 lg:mt-14">
          <div className="col-span-12 flex flex-col gap-7 lg:col-span-6">
            <p className="max-w-[54ch] text-lead text-slate-700">
              {doc.cta.body}
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="/contact" variant="signal">
                Contact Us Today
              </ButtonLink>
              <ButtonLink
                href="/projects"
                variant="ghost"
                className="underline"
              >
                View Our Projects
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
