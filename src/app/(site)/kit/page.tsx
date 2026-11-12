import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { BRAND_ICONS, type BrandIconName } from "@/components/brand/icon-data";
import { Logo } from "@/components/brand/Logo";
import { ExplodedSymbol, PathwayGlyph, SymbolCrop } from "@/components/brand/Symbol";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Figure, KeyFigure, SpecList, Tag } from "@/components/ui/Editorial";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";
import { Overline, Rule, Stop, Tagline } from "@/components/ui/Typography";
import { pathways } from "@/content/pathways";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Component kit", robots: { index: false, follow: false } };

const SWATCHES = [
  { name: "Midnight Navy", hex: "#0C1446", cls: "bg-navy text-white", role: "Primary — text, headlines, dark surfaces" },
  { name: "Cobalt Blue", hex: "#315BDB", cls: "bg-cobalt text-white", role: "Secondary — links, digital layers, charts" },
  { name: "Sky Blue", hex: "#8BBDFB", cls: "bg-sky text-navy", role: "Support — highlights on dark, data" },
  { name: "Signal Orange", hex: "#FF5200", cls: "bg-orange text-navy", role: "Accent — one focal point per view" },
  { name: "Off White", hex: "#F8FAFD", cls: "bg-paper text-navy border border-slate-200", role: "Base — backgrounds and space" },
];
const NEUTRALS = [
  { name: "Slate 700", hex: "#3D4556", cls: "bg-slate-700" },
  { name: "Slate 500", hex: "#6E7787", cls: "bg-slate-500" },
  { name: "Slate 300", hex: "#CBD2DF", cls: "bg-slate-300" },
  { name: "Slate 200", hex: "#E3E7EF", cls: "bg-slate-200" },
];
const TYPE = [
  { token: "display", cls: "text-display", spec: "ExtraBold 800 · 72 / 1.05 · −2.5%", sample: "Built with Intelligence" },
  { token: "h1", cls: "text-h1", spec: "ExtraBold 800 · 48 / 1.1 · −2%", sample: "Coordinated delivery" },
  { token: "h2", cls: "text-h2", spec: "Bold 700 · 32 / 1.2 · −1%", sample: "One model, every trade" },
  { token: "h3", cls: "text-h3", spec: "Bold 700 · 22 / 1.3", sample: "Scan to BIM and digital twins" },
  { token: "lead", cls: "text-lead", spec: "Regular 400 · 20 / 1.5", sample: "We connect the physical building with its digital model, so every trade works from the same truth." },
  { token: "body", cls: "text-body", spec: "Regular 400 · 16 / 1.55", sample: "Accurate capture, coordinated design and live building data in a single workflow." },
  { token: "caption", cls: "text-caption", spec: "Medium 500 · 13 / 1.4 · +1%", sample: "Source: group project data, 2025" },
] as const;
const UI_ICONS: IconName[] = ["arrow-right", "arrow-up-right", "arrow-left", "arrow-down", "chevron-down", "plus", "minus", "close", "menu", "download", "external", "grid", "list", "play", "mail", "phone"];

function KitHeading({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <Overline index={index}>Kit</Overline>
      <h2 className="text-h1">{title}</h2>
      {note ? <p className="measure text-slate-700">{note}</p> : null}
    </div>
  );
}

export default function KitPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const project = projects.find((p) => p.slug === "king-abdullah-financial-district")!;

  return (
    <>
      <Section surface="paper" className="pt-[calc(var(--header-h)+4rem)]">
        <Container>
          <Overline>Development only · not indexed</Overline>
          <h1 className="mt-5 text-display">
            Component kit<Stop />
          </h1>
          <p className="measure mt-6 text-lead text-slate-700">
            Every token, brand device and component used on the site, drawn from the SBT brand system. Review here
            before sections are assembled.
          </p>
        </Container>
      </Section>

      {/* 01 Colour */}
      <Section surface="white">
        <Container>
          <KitHeading index="01" title="Colour" note="Five colours with fixed roles. Roughly 40% off white, 35% navy, 12% cobalt, 8% sky and 5% orange per page." />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {SWATCHES.map((s) => (
              <div key={s.hex} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-slate-200">
                <div className={`flex h-36 items-end p-4 font-bold ${s.cls}`}>{s.name}</div>
                <div className="flex flex-col gap-1 bg-white p-4 text-caption">
                  <span className="tabular font-semibold">{s.hex}</span>
                  <span className="text-slate-500">{s.role}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {NEUTRALS.map((n) => (
              <div key={n.hex} className="flex items-center gap-3 text-caption">
                <span className={`size-10 rounded-lg ${n.cls}`} />
                <span>
                  <span className="block font-semibold">{n.name}</span>
                  <span className="tabular text-slate-500">{n.hex}</span>
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 02 Type */}
      <Section surface="paper">
        <Container>
          <KitHeading index="02" title="Typography" note="Plus Jakarta Sans only. Seven sizes, nothing in between. Fluid from 360px to 1440px." />
          <div className="border-t border-slate-200">
            {TYPE.map((t) => (
              <div key={t.token} className="grid gap-3 border-b border-slate-200 py-7 md:grid-cols-[14rem_1fr] md:gap-10">
                <div className="text-caption">
                  <p className="font-semibold uppercase tracking-[0.14em]">{t.token}</p>
                  <p className="tabular text-slate-500">{t.spec}</p>
                </div>
                <p className={t.cls}>{t.sample}</p>
              </div>
            ))}
            <div className="grid gap-3 border-b border-slate-200 py-7 md:grid-cols-[14rem_1fr] md:gap-10">
              <div className="text-caption">
                <p className="font-semibold uppercase tracking-[0.14em]">overline</p>
                <p className="tabular text-slate-500">SemiBold 600 · 13 · +20% · caps</p>
              </div>
              <Overline index="03">Selected work</Overline>
            </div>
            <div className="grid gap-3 border-b border-slate-200 py-7 md:grid-cols-[14rem_1fr] md:gap-10">
              <div className="text-caption">
                <p className="font-semibold uppercase tracking-[0.14em]">quote</p>
                <p className="tabular text-slate-500">Italic 400 · quotes only</p>
              </div>
              <blockquote className="quote border-l-2 border-orange pl-5 text-h3 font-normal">
                “Every trade worked from the same model, and it showed on site.”
              </blockquote>
            </div>
          </div>
        </Container>
      </Section>

      {/* 03 Logo */}
      <Section surface="white">
        <Container>
          <KitHeading index="03" title="Logo" note="Extracted from the vector artwork in Brand Guidelines v1.0. Four lockups, three tones." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-card)] border border-slate-200 p-8">
              <Logo lockup="primary" className="w-[78%]" />
            </div>
            <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-card)] border border-slate-200 p-8">
              <Logo lockup="horizontal" className="w-[86%]" />
            </div>
            <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-card)] border border-slate-200 p-8">
              <Logo lockup="stacked" className="w-[38%]" />
            </div>
            <div className="flex aspect-[4/3] items-center justify-center gap-6 rounded-[var(--radius-card)] border border-slate-200 p-8">
              <div className="flex size-24 items-center justify-center rounded-[22px] bg-navy p-5">
                <Logo lockup="symbol" tone="inverse" />
              </div>
              <div className="flex size-24 items-center justify-center rounded-[22px] border border-slate-200 bg-white p-5">
                <Logo lockup="symbol" />
              </div>
            </div>
            <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-card)] bg-navy p-8 md:col-span-2">
              <Logo lockup="horizontal" tone="inverse" className="w-[70%]" />
            </div>
            <div className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-card)] bg-slate-200 p-8 text-navy md:col-span-2">
              <Logo lockup="horizontal" tone="mono" className="w-[70%]" />
            </div>
          </div>
          <p className="mt-8 text-lead">
            <Tagline />
          </p>
        </Container>
      </Section>

      {/* 04 Symbol devices */}
      <Section surface="navy" className="overflow-hidden">
        <Container>
          <KitHeading index="04" title="Symbol devices" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-3">
              <div className="flex aspect-square items-center justify-center rounded-[var(--radius-card)] border border-[var(--hairline)] p-10">
                <ExplodedSymbol tone="inverse" className="w-3/4" />
              </div>
              <p className="text-caption text-white/64">Exploded symbol · assembles once along the 30° axis</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-midnight-depth">
                <SymbolCrop tone="ghost-white" className="absolute -right-1/4 -bottom-1/4 w-[120%]" />
              </div>
              <p className="text-caption text-white/64">Symbol crop · white at 12% on Midnight depth</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-paper">
                <div className="bg-lattice absolute inset-0" />
                <SymbolCrop tone="ghost-navy" className="absolute -right-1/4 -bottom-1/4 w-[120%]" />
              </div>
              <p className="text-caption text-white/64">Light field · isometric lattice and navy crop at 7%</p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {pathways.map((p) => (
              <div key={p.id} className="flex items-center gap-4 border-t border-[var(--hairline)] pt-4">
                <PathwayGlyph pathway={p.id} surface="dark" className="size-12" />
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-caption uppercase tracking-[0.14em] text-white/60">{p.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 05 Icons */}
      <Section surface="paper">
        <Container>
          <KitHeading index="05" title="Icons" note="Brand icons from Graphic Language p.8, plus interface icons drawn on the same rules." />
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-[var(--radius-card)] border border-slate-200 bg-slate-200 sm:grid-cols-8">
            {(Object.keys(BRAND_ICONS) as BrandIconName[]).map((name) => (
              <div key={name} className="flex flex-col items-center gap-3 bg-white px-2 py-6 text-caption">
                <BrandIcon name={name} size={28} />
                <span className="text-slate-500">{name}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-6 text-navy">
            {UI_ICONS.map((name) => (
              <span key={name} className="flex flex-col items-center gap-2 text-caption text-slate-500">
                <Icon name={name} size={24} className="text-navy" />
                {name}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* 06 Actions */}
      <Section surface="white">
        <Container>
          <KitHeading index="06" title="Actions" note="Orange is the one call to action per view, with a navy label. Everything else is navy, white or text." />
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact" variant="signal">Start a project</ButtonLink>
            <ButtonLink href="/contact" variant="primary">Get in touch</ButtonLink>
            <ButtonLink href="/contact" variant="outline">Download profile</ButtonLink>
            <ButtonLink href="/projects" variant="ghost">See selected work</ButtonLink>
            <ButtonLink href="/contact" variant="primary" size="sm" icon={null}>Small</ButtonLink>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] bg-navy p-6" data-surface="dark">
            <ButtonLink href="/contact" variant="signal">Start a project</ButtonLink>
            <ButtonLink href="/contact" variant="inverse">Get in touch</ButtonLink>
            <ButtonLink href="/contact" variant="outline-inverse">Download profile</ButtonLink>
            <ButtonLink href="/projects" variant="ghost" className="text-white">See selected work</ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <Tag>BIM in design</Tag>
            <Tag>Reality capture</Tag>
            <Tag>ISO 19650</Tag>
          </div>
          <Breadcrumbs className="mt-8" items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Reality capture" }]} />
        </Container>
      </Section>

      {/* 07 Editorial */}
      <Section surface="paper">
        <Container>
          <KitHeading index="07" title="Editorial components" />
          <div className="grid-12 gap-y-12">
            <Figure
              className="col-span-12 md:col-span-7"
              src={project.image.src}
              alt="King Abdullah Financial District skyline, Riyadh"
              width={project.image.width}
              height={project.image.height}
              number={1}
              caption="King Abdullah Financial District, Riyadh. Digital twin and operational BIM."
              sizes="(min-width: 768px) 58vw, 100vw"
              aspect="4/3"
            />
            <div className="col-span-12 flex flex-col gap-10 md:col-span-5">
              <SpecList
                items={[
                  { term: "Client", value: project.client },
                  { term: "Location", value: project.location },
                  { term: "Sector", value: project.sector },
                  { term: "Scope", value: project.scope.join(" · ") },
                ]}
              />
              <div className="grid grid-cols-2 gap-6">
                <KeyFigure value="LOD 500" label="Asset information model" />
                <KeyFigure value="22" label="Projects in the group record" signal />
              </div>
            </div>
          </div>
          <Rule className="my-16" />
          <div className="grid-12">
            <div className="col-span-12 md:col-span-4">
              <Overline index="07">Questions</Overline>
            </div>
            <Accordion
              className="col-span-12 mt-6 md:col-span-8 md:mt-0"
              name="kit-faq"
              items={[
                { id: "a", question: "Is SBT part of TXG?", answer: "Yes. Smart Built Technologies is the Chennai-based company of the Technical Xperts Group, founded in Riyadh in 2014." },
                { id: "b", question: "Do you deliver BIM to ISO 19650?", answer: "Yes. Our BIM delivery follows ISO 19650." },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
