import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { StickyPin } from "@/components/ui/StickyPin";
import { Overline } from "@/components/ui/Typography";
import { faqJsonLd, JsonLd } from "@/lib/jsonld";

/** Questions and answers for one service, with FAQPage data for search. */
export function ServiceFaq({
  index,
  faqs,
}: {
  index: string;
  faqs: { id: string; question: string; answer: string }[];
}) {
  return (
    <Section surface="white" aria-labelledby="service-faq-title">
      <div className="container-x">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <StickyPin topRem={3} className="flex flex-col gap-6">
              <Overline index={index} className="text-slate-700">
                FAQ
              </Overline>
              <h2 id="service-faq-title" className="text-h1">
                Frequently Asked Questions
              </h2>
            </StickyPin>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Accordion
              name="service-faq"
              items={faqs.map((f) => ({
                id: f.id,
                question: f.question,
                answer: <p>{f.answer}</p>,
              }))}
            />
          </div>
        </div>
      </div>
      <JsonLd data={faqJsonLd(faqs)} />
    </Section>
  );
}
