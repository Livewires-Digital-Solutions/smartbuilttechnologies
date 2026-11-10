import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Surface = "paper" | "white" | "navy" | "midnight" | "cobalt";

const surfaces: Record<Surface, string> = {
  paper: "surface-paper",
  white: "surface-white",
  navy: "surface-navy",
  midnight: "surface-navy bg-midnight-depth",
  cobalt: "surface-cobalt",
};

/**
 * A page section. `surface` sets background, text and hairline colours in one
 * place; dark surfaces also tell the header to switch to its inverse logo
 * when they sit at the top of the page.
 */
export function Section({
  surface = "paper",
  spacing = true,
  className,
  children,
  ...props
}: {
  surface?: Surface;
  spacing?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"section">, "className" | "children">) {
  const dark = surface === "navy" || surface === "midnight" || surface === "cobalt";
  return (
    <section
      data-surface={dark ? (surface === "cobalt" ? "cobalt" : "dark") : "light"}
      data-header={dark ? "dark" : undefined}
      className={cn("relative", surfaces[surface], spacing && "section-y", className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("container-x", className)}>{children}</div>;
}
