import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";

/** Vision and mission are the group's own (txgksa.com); the values are its three. */
const values = [
  {
    title: "Quality & teamwork",
    text: "Every discipline works from one coordinated model, and the people behind it work as one team.",
  },
  {
    title: "Precision & excellence",
    text: "Models and data built to the level of detail the project needs, and checked before they leave us.",
  },
  {
    title: "Commitment & integrity",
    text: "We say what we can deliver, then deliver it, from the first brief to the final handover.",
  },
];

/** Vision, mission and values: two statements, then three ruled columns. */
export function AboutPrinciples() {
  return (
    <Section surface="white" aria-labelledby="principles-title">
      <div className="container-x">
        <SectionHead
          id="principles-title"
          index="03"
          label="Vision, mission, values"
        >
          What we work towards
        </SectionHead>

        <div className="grid-12 mt-12 gap-y-12 lg:mt-16">
          <div className="reveal col-span-12 flex flex-col gap-4 lg:col-span-5 lg:col-start-4">
            <Label className="text-slate-700">Vision</Label>
            <p className="text-statement">
              Redefine construction by integrating advanced BIM and digital
              delivery.
            </p>
          </div>
          <div className="reveal col-span-12 flex flex-col gap-4 lg:col-span-4 lg:col-start-9">
            <Label className="text-slate-700">Mission</Label>
            <p className="text-lead text-slate-700">
              Empower construction excellence with innovative digital delivery,
              ensuring cost-effective design and planning.
            </p>
          </div>
        </div>

        <ul className="reveal mt-16 grid border-t-[1.5px] border-t-navy lg:mt-24 lg:grid-cols-3">
          {values.map((v, i) => (
            <li
              key={v.title}
              className="flex flex-col gap-4 border-b border-[var(--hairline)] py-8 lg:border-b-0 lg:py-10 lg:pr-10 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-10"
            >
              <Label className="text-slate-700">
                Value {String(i + 1).padStart(2, "0")}
              </Label>
              <h3 className="text-h2">{v.title}</h3>
              <p className="max-w-[38ch] text-slate-700">{v.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
