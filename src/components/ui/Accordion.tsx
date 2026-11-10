import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Accordion built on native <details>, so it works without JavaScript and is
 * found by in-page search. `name` makes items in a group exclusive.
 */
export function Accordion({
  items,
  name,
  className,
}: {
  items: { id: string; question: string; answer: ReactNode }[];
  name?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-[var(--hairline)]", className)}>
      {items.map((item) => (
        <details key={item.id} name={name} className="group border-b border-[var(--hairline)]">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-h3 font-bold [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="relative mt-1.5 size-5 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-[1.75px] before:w-5 before:-translate-y-1/2 before:rounded-full before:bg-current after:absolute after:top-0 after:left-1/2 after:h-5 after:w-[1.75px] after:-translate-x-1/2 after:rounded-full after:bg-current after:transition-transform after:duration-[var(--duration-ui)] after:ease-[var(--ease-out)] group-open:after:scale-y-0"
            />
          </summary>
          <div className="measure pb-6 text-body text-slate-700 [[data-surface=dark]_&]:text-white/75">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
