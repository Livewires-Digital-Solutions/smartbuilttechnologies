import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { StickyPin } from "@/components/ui/StickyPin";
import { Overline } from "@/components/ui/Typography";
import { ApplyForm, type ApplyJob } from "./ApplyForm";

/**
 * The application form on the page's navy band, like the Contact page: the invitation
 * stays in view on the left while the form scrolls on the right. Used on the careers
 * page (choose any position) and on each job page (`fixed`).
 */
export function ApplyBand({
  index,
  overline,
  title,
  children,
  jobs,
  fixed,
}: {
  index: string;
  overline: string;
  title: string;
  children: ReactNode;
  jobs: ApplyJob[];
  fixed?: ApplyJob;
}) {
  return (
    <Section surface="navy" id="apply" aria-labelledby="apply-title">
      <div className="container-x">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <StickyPin topRem={3} className="flex flex-col gap-7">
              <Overline index={index} className="text-white/70">
                {overline}
              </Overline>
              <h2 id="apply-title" className="text-h1 text-balance">
                {title}
              </h2>
              <div className="flex max-w-[44ch] flex-col gap-4 text-lead text-white/75">
                {children}
              </div>
            </StickyPin>
          </div>

          <div className="col-span-12 flex flex-col gap-8 lg:col-span-6 lg:col-start-7">
            <h3 className="border-t border-white/25 pt-4 font-mono text-overline font-medium text-sky uppercase">
              Submit your application using the form.
            </h3>
            <ApplyForm jobs={jobs} fixed={fixed} />
          </div>
        </div>
      </div>
    </Section>
  );
}
