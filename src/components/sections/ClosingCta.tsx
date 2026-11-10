import { SymbolCrop } from "@/components/brand/Symbol";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";
import { Overline } from "@/components/ui/Typography";
import { site } from "@/content/site";

/**
 * Closing call to action. Sits directly above the footer so the two read as
 * one navy block. This is the page's single orange CTA.
 */
export function ClosingCta({
  title = "Tell us what you are building.",
  body = `Share drawings, a scan or just a brief. A BIM lead in Chennai will reply within ${site.contact.replyTime}.`,
}: {
  title?: string;
  body?: string;
}) {
  const head = site.offices[0];
  return (
    <Section surface="navy" className="overflow-hidden" aria-labelledby="closing-cta-title">
      <SymbolCrop
        tone="ghost-white"
        className="absolute -right-[22%] -bottom-[38%] w-[90%] max-w-[760px] sm:-right-[10%] md:w-[52%] lg:-bottom-[48%]"
      />
      <Container className="relative">
        <div className="grid-12 gap-y-12">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
            <Overline>Start a project</Overline>
            <h2 id="closing-cta-title" className="text-h1 max-w-[16ch]">
              {title}
            </h2>
            <p className="measure text-lead text-white/75">{body}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href="/contact" variant="signal">
                Start a project
              </ButtonLink>
              <ButtonLink href="/projects" variant="ghost" icon="arrow-right">
                See our projects
              </ButtonLink>
            </div>
          </div>
          <dl className="col-span-12 grid content-end gap-6 sm:grid-cols-3 lg:col-span-4 lg:col-start-9 lg:grid-cols-1">
            <div className="flex flex-col gap-1.5 border-t border-[var(--hairline)] pt-4">
              <dt className="text-caption uppercase tracking-[0.16em] text-white/56">Email</dt>
              <dd>
                <a href={`mailto:${site.contact.salesEmail}`} className="inline-flex items-center gap-2 font-semibold hover:underline">
                  <Icon name="mail" size={18} /> {site.contact.salesEmail}
                </a>
              </dd>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-[var(--hairline)] pt-4">
              <dt className="text-caption uppercase tracking-[0.16em] text-white/56">Phone</dt>
              <dd>
                <a href={site.contact.phoneHref} className="tabular inline-flex items-center gap-2 font-semibold hover:underline">
                  <Icon name="phone" size={18} /> {site.contact.phone}
                </a>
              </dd>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-[var(--hairline)] pt-4">
              <dt className="text-caption uppercase tracking-[0.16em] text-white/56">Office</dt>
              <dd className="font-semibold">
                {head?.city}, {head?.country} <span className="font-normal text-white/64">· {site.contact.hours}</span>
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </Section>
  );
}
