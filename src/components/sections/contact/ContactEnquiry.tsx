import { Section } from "@/components/ui/Section";
import { StickyPin } from "@/components/ui/StickyPin";
import { Overline } from "@/components/ui/Typography";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";

/**
 * The enquiry form on the page's one navy band, like "Why choose us" on the home
 * page: the invitation stays in view on the left while the form scrolls on the right.
 */
export function ContactEnquiry() {
  return (
    <Section surface="navy" id="enquiry" aria-labelledby="enquiry-title">
      <div className="container-x">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <StickyPin topRem={3} className="flex flex-col gap-7">
              <Overline index="01" className="text-white/70">
                Collaborate With Us
              </Overline>
              <h2 id="enquiry-title" className="text-h1 text-balance">
                Ready to build together?
              </h2>
              <p className="max-w-[44ch] text-lead text-white/75">
                Whether you have a specific project in mind, need technical
                consultation, or want to explore digital construction solutions,
                our experts are ready to assist you.
              </p>
            </StickyPin>
          </div>

          <div className="col-span-12 flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
            <h3 className="border-t border-white/25 pt-4 font-mono text-overline font-medium text-sky uppercase">
              Send a Message
            </h3>
            <ContactForm to={site.contact.email} />
          </div>
        </div>
      </div>
    </Section>
  );
}
