"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Label } from "@/components/ui/Typography";

/** Something broke while showing a page: say so, and let the visitor try again. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Section
      surface="paper"
      spacing={false}
      aria-labelledby="error-title"
      className="pt-[var(--header-h)]"
    >
      <div className="container-x pb-24">
        <div className="border-t border-b border-t-navy border-b-[var(--hairline)] py-2.5">
          <Label>Smart Built Technologies · Error</Label>
        </div>
        <div className="flex max-w-[52ch] flex-col gap-5 py-16">
          <h1
            id="error-title"
            className="text-[clamp(2.25rem,5vw,4rem)] leading-[0.98] font-medium tracking-[-0.05em]"
          >
            Something went wrong.
          </h1>
          <p
            role="alert"
            className="text-[1.0625rem] leading-snug text-slate-700"
          >
            This page could not be shown. Please try again. If it keeps
            happening, write to us from the contact page.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <Button type="button" variant="signal" onClick={() => reset()}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
