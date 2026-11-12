import { connection } from "next/server";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { site } from "@/content/site";
import { dbConfigured } from "@/lib/db";
import { listOpenJobs, type Job } from "@/lib/jobs";
import { ApplyBand } from "./ApplyBand";
import { OpeningsList } from "./OpeningsList";

/** Placeholder rows while the openings load, so the page does not jump. */
export function OpeningsSkeleton() {
  return (
    <Section surface="paper" id="openings" aria-label="Current openings">
      <div className="container-x">
        <div className="h-12 w-72 max-w-full animate-pulse bg-navy/8" />
        <div className="mt-12 border-t-[1.5px] border-t-navy">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-6 border-b border-[var(--hairline)] py-9"
            >
              <div className="h-10 w-1/2 animate-pulse bg-navy/8" />
              <div className="h-4 w-1/4 animate-pulse bg-navy/8" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/**
 * The live part of the page: the open positions and the application form, which lists
 * them. It reads MySQL at request time, so a role you publish in the admin area is on
 * the page straight away. If the database cannot be reached the page still works: the
 * list says so and the form still takes a general application.
 */
export async function CareersContent() {
  // request time only; kept outside the try so the prerender can stop here
  await connection();
  let jobs: Job[] = [];
  let unavailable = false;
  if (!dbConfigured()) {
    unavailable = true;
  } else {
    try {
      jobs = await listOpenJobs();
    } catch (e) {
      console.error("[careers] could not load open positions:", e);
      unavailable = true;
    }
  }

  return (
    <>
      <Section surface="paper" id="openings" aria-labelledby="openings-title">
        <div className="container-x">
          <SectionHead
            id="openings-title"
            index="01"
            label="Current Openings"
            aside={
              !unavailable && jobs.length > 0 ? (
                <p className="font-mono text-overline text-slate-700 uppercase">
                  {jobs.length} open{" "}
                  {jobs.length === 1 ? "position" : "positions"}
                </p>
              ) : null
            }
          >
            Open Positions
          </SectionHead>
          <OpeningsList jobs={jobs} unavailable={unavailable} />
        </div>
      </Section>

      <ApplyBand
        index="02"
        overline="Recruitments"
        title="Join our growing team."
        jobs={jobs.map((j) => ({ slug: j.slug, title: j.title }))}
      >
        <p>
          We are hiring BIM Modellers, BIM Engineers, Team Leaders, and BIM
          Coordinators (all discipline) for our new projects. Locations will be
          in India and Middle East. Those who are interested, rush their CVs to{" "}
          <a
            href={`mailto:${site.contact.careersEmail}`}
            className="font-semibold text-white underline underline-offset-[5px]"
          >
            {site.contact.careersEmail}
          </a>
          .
        </p>
      </ApplyBand>
    </>
  );
}
