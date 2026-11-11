import { SymbolCrop } from "@/components/brand/Symbol";
import { ButtonLink } from "@/components/ui/Button";
import { Label, Stop } from "@/components/ui/Typography";
import { site } from "@/content/site";

/**
 * Closing call to action. The page opens on a headline and ends on one: the same
 * scale, on a pale cobalt field, just above the navy footer. A ghost crop of the
 * symbol sits behind it.
 */
export function HomeCta() {
  const head = site.offices.find((o) => o.primary);
  return (
    <section
      aria-labelledby="cta-title"
      data-surface="light"
      className="relative overflow-hidden bg-cobalt-10 text-navy [--hairline:rgb(12_20_70/0.18)]"
    >
      <SymbolCrop
        tone="ghost-navy"
        className="absolute -right-[10%] -bottom-[22%] w-[min(66vw,900px)]"
      />
      <div className="container-x section-y relative">
        <div className="flex items-center justify-between gap-6 border-t border-t-navy pt-3">
          <Label>Step 00 · Initiation</Label>
          <Label className="hidden text-slate-700 sm:block">
            Reply within {site.contact.replyTime}
          </Label>
        </div>

        <h2
          id="cta-title"
          className="reveal mt-12 max-w-[13ch] text-display lg:mt-16"
        >
          Tell us what you are building
          <Stop />
        </h2>

        <div className="grid-12 mt-12 gap-y-10 lg:mt-16">
          <div className="col-span-12 flex flex-col gap-7 lg:col-span-5">
            <p className="max-w-[42ch] text-lead text-slate-700">
              Share drawings, a scan or just a brief. A BIM lead in Chennai will
              reply with a plan for how we would model, scan or connect your
              project.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="/contact" variant="signal">
                Start a conversation
              </ButtonLink>
              <ButtonLink
                href="/projects"
                variant="ghost"
                className="underline"
              >
                Explore the projects
              </ButtonLink>
            </div>
          </div>

          <dl className="col-span-12 border-t-[1.5px] border-t-navy lg:col-span-5 lg:col-start-8">
            {[
              [
                "Write",
                <a
                  key="e"
                  href={`mailto:${site.contact.salesEmail}`}
                  className="underline-offset-[5px] hover:underline"
                >
                  {site.contact.salesEmail}
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
              [
                "Visit",
                <span key="v">
                  {head?.city}, {head?.country}{" "}
                  <span className="text-slate-700">· {site.contact.hours}</span>
                </span>,
              ],
            ].map(([k, v]) => (
              <div
                key={String(k)}
                className="grid grid-cols-[5rem_1fr] gap-4 border-b border-[var(--hairline)] py-4"
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
    </section>
  );
}
