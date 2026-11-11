import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { Overline } from "@/components/ui/Typography";
import { StickyPin } from "@/components/ui/StickyPin";
import { homeFaqs } from "@/content/faq";
import { site } from "@/content/site";
import { faqJsonLd, JsonLd } from "@/lib/jsonld";

/** FAQ: heading and a short note stay in view on the left while the answers open on the right. */
export function HomeFaq() {
  return (
    <Section surface="paper" aria-labelledby="faq-title">
      <div className="container-x">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <StickyPin topRem={3} className="flex flex-col gap-6">
              <Overline index="08" className="text-slate-700">
                FAQ
              </Overline>
              <h2 id="faq-title" className="text-h1">
                Frequently asked questions
              </h2>
              <p className="max-w-[36ch] text-slate-700">
                Something else on your mind? Write to{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-semibold text-navy underline underline-offset-[5px]"
                >
                  {site.contact.email}
                </a>{" "}
                and a BIM lead will reply within {site.contact.replyTime}.
              </p>
            </StickyPin>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Accordion
              name="home-faq"
              items={homeFaqs.map((f) => ({
                id: f.id,
                question: f.question,
                answer: <p>{f.answer}</p>,
              }))}
            />
          </div>
        </div>
      </div>
      <JsonLd data={faqJsonLd(homeFaqs)} />
    </Section>
  );
}
