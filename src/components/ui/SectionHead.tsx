import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Overline } from "./Typography";

/**
 * The head of every home section: a mono running head in columns 1–3 and the
 * section title in columns 4–11, so the page keeps one reading line down the
 * left margin. `tone="dark"` is for navy bands.
 */
export function SectionHead({
  id,
  index,
  label,
  children,
  aside,
  tone = "light",
  className,
}: {
  id: string;
  index?: string;
  label: string;
  children: ReactNode;
  aside?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("grid-12 items-start gap-y-5", className)}>
      <Overline
        index={index}
        className={cn("col-span-12 self-start lg:col-span-3 lg:pt-3", tone === "dark" ? "text-white/70" : "text-slate-700")}
      >
        {label}
      </Overline>
      <h2 id={id} className="col-span-12 text-h1 lg:col-span-8 lg:col-start-4">
        {children}
      </h2>
      {aside ? <div className="col-span-12 lg:col-span-6 lg:col-start-4">{aside}</div> : null}
    </div>
  );
}
