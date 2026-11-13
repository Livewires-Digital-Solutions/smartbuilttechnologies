import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label, Stop } from "@/components/ui/Typography";
import { employmentLabel, workModeLabel } from "@/content/careers";
import { site } from "@/content/site";
import { isOpenNow, type Job } from "@/lib/jobs";
import { breadcrumbJsonLd, JsonLd } from "@/lib/jsonld";
import { ApplyBand } from "./ApplyBand";

const date = (d: string) =>
  new Date(d.length === 10 ? `${d}T00:00:00Z` : d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const SCHEMA_TYPE = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
} as const;

function jobPostingJsonLd(job: Job) {
  const place = job.location.split(",").map((s) => s.trim());
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [
      job.summary,
      job.description,
      ...job.responsibilities,
      ...job.requirements,
    ]
      .filter(Boolean)
      .join("\n\n"),
    datePosted: (job.publishedAt ?? job.createdAt).slice(0, 10),
    validThrough: job.closesOn ?? undefined,
    employmentType: SCHEMA_TYPE[job.employmentType],
    hiringOrganization: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      sameAs: site.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: place[0],
        addressCountry: place[place.length - 1],
      },
    },
    jobLocationType: job.workMode === "remote" ? "TELECOMMUTE" : undefined,
    directApply: true,
  };
}

/** A job's own page: the role, what it involves, and the application form (or a note that it has closed). */
export function JobView({ job }: { job: Job }) {
  const open = isOpenNow(job);
  const facts: [string, string][] = [
    ["Department", job.department],
    ["Location", job.location],
    ["Type", employmentLabel(job.employmentType)],
    ["Work mode", workModeLabel(job.workMode)],
    ...(job.experience
      ? ([["Experience", job.experience]] as [string, string][])
      : []),
    ...(job.salary ? ([["Salary", job.salary]] as [string, string][]) : []),
    ...(job.closesOn && open
      ? ([["Closes", date(job.closesOn)]] as [string, string][])
      : []),
  ];
  const paragraphs = (job.description ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const lists = [
    { label: "Responsibilities", items: job.responsibilities },
    { label: "Requirements", items: job.requirements },
    { label: "Benefits", items: job.benefits },
  ].filter((l) => l.items.length > 0);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
            { name: job.title, path: `/careers/${job.slug}` },
          ]),
          ...(open ? [jobPostingJsonLd(job)] : []),
        ]}
      />
      <div className="scroll-progress" aria-hidden="true" />

      <Section
        surface="paper"
        spacing={false}
        aria-labelledby="job-title"
        className="pt-[var(--header-h)] lg:flex lg:min-h-[min(100svh,880px)] lg:flex-col"
      >
        <div className="container-x flex w-full flex-1 flex-col pb-10 lg:pb-12">
          <div className="grid-12 flex-1 items-stretch gap-y-8">
            <div className="relative z-10 col-span-12 flex flex-col lg:col-span-7 lg:pr-10">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
                <Label>Smart Built Technologies · Careers</Label>
                <Label className="text-slate-700">
                  {open ? "Now hiring" : "Position closed"}
                </Label>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-[clamp(1rem,2.4svh,1.5rem)] py-8">
                <Breadcrumbs
                  className="text-slate-700"
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Careers", href: "/careers" },
                    { label: job.title },
                  ]}
                />
                <h1
                  id="job-title"
                  className="text-[clamp(2.25rem,min(5.2vw,9svh),5.25rem)] leading-[0.97] font-medium tracking-[-0.055em] text-balance"
                >
                  <span
                    className="hero-line"
                    style={{ "--i": 0 } as CSSProperties}
                  >
                    <span>
                      {job.title}
                      <Stop />
                    </span>
                  </span>
                </h1>
                <p className="max-w-[52ch] text-[1.0625rem] leading-snug text-slate-700">
                  {job.summary}
                </p>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                  {open ? (
                    <ButtonLink
                      href="#apply"
                      variant="signal"
                      icon="arrow-down"
                    >
                      Apply now
                    </ButtonLink>
                  ) : null}
                  <ButtonLink
                    href="/careers#openings"
                    variant="ghost"
                    className="underline"
                  >
                    All open positions
                  </ButtonLink>
                </div>

                <dl className="mt-1 border-t-[1.5px] border-t-navy">
                  {facts.map(([k, v]) => (
                    <div
                      key={k}
                      className="grid grid-cols-[7rem_1fr] gap-4 border-b border-[var(--hairline)] py-2.5"
                    >
                      <dt className="pt-1">
                        <Label className="text-slate-700">{k}</Label>
                      </dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <figure className="relative col-span-12 flex flex-col lg:col-span-5">
              <div className="relative min-h-[320px] flex-1 overflow-hidden bg-slate-200 max-lg:aspect-[4/3]">
                <Image
                  src="/assets/misc/team-at-work.jpg"
                  alt="A hand holding a building model over architectural drawings"
                  width={1040}
                  height={660}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  priority
                  className="grade absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: "62% 50%" }}
                />
                <span className="absolute top-0 left-0 bg-navy px-3 py-2 font-mono text-overline text-white uppercase">
                  {open ? "Now hiring" : "Position closed"}
                </span>
              </div>
              <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
                <Label className="text-slate-700">
                  Fig. 01 · {job.department}
                </Label>
                <Label className="text-slate-700">
                  The production firm of TXG, KSA
                </Label>
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      {paragraphs.length > 0 || lists.length > 0 ? (
        <Section surface="white" aria-labelledby="role-title">
          <div className="container-x">
            <SectionHead id="role-title" index="01" label="About the role">
              What the role involves
            </SectionHead>

            {paragraphs.length > 0 ? (
              <div className="grid-12 mt-12 lg:mt-16">
                <div className="col-span-12 flex flex-col gap-5 lg:col-span-7 lg:col-start-4">
                  {paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "max-w-[56ch] text-[clamp(1.25rem,1rem+0.9vw,1.75rem)] leading-[1.3] tracking-[-0.02em]"
                          : "max-w-[60ch] text-lead text-slate-700"
                      }
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {lists.map((l) => (
              <div key={l.label} className="grid-12 mt-14 gap-y-4 lg:mt-20">
                <Label className="col-span-12 pt-3 text-slate-700 lg:col-span-3">
                  {l.label}
                </Label>
                <ol className="col-span-12 border-t-[1.5px] border-t-navy lg:col-span-8 lg:col-start-4">
                  {l.items.map((it, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[2.25rem_1fr] items-baseline gap-x-4 border-b border-[var(--hairline)] py-4"
                    >
                      <span className="font-mono text-overline text-slate-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="max-w-[62ch] text-[1.0625rem]">
                        {it}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {open ? (
        <ApplyBand
          index={paragraphs.length > 0 || lists.length > 0 ? "02" : "01"}
          overline="Apply"
          title={`Apply for ${job.title}.`}
          jobs={[]}
          fixed={{ slug: job.slug, title: job.title }}
        >
          <p>
            Tell us about yourself and attach your CV. Our hiring team reads
            every application and will be in touch if your profile matches.
          </p>
        </ApplyBand>
      ) : (
        <Section surface="paper" aria-labelledby="closed-title">
          <div className="container-x">
            <div className="flex flex-col gap-5 border-t-[1.5px] border-t-navy pt-8">
              <Label className="text-slate-700">Position closed</Label>
              <h2 id="closed-title" className="max-w-[20ch] text-h1">
                This position is no longer open.
              </h2>
              <p className="max-w-[52ch] text-lead text-slate-700">
                We are not taking applications for {job.title} any more. See
                what is open now, or send us your CV and we will keep it for the
                next project.
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                <ButtonLink href="/careers#openings" variant="signal">
                  See open positions
                </ButtonLink>
                <Link
                  href="/careers#apply"
                  className="group inline-flex min-h-11 items-center gap-2 font-semibold text-navy"
                >
                  <span className="underline underline-offset-[6px]">
                    Send your CV anyway
                  </span>
                  <Icon
                    name="arrow-right"
                    size={16}
                    className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
