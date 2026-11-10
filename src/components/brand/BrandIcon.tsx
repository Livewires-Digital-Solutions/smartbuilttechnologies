import { cn } from "@/lib/cn";
import { BRAND_ICONS, type BrandIconName } from "./icon-data";

/**
 * Brand line icons (Graphic Language p.8): 24px grid, 1.75px stroke,
 * round caps and joins, 30° diagonals, one filled orange node.
 * Navy on light, white on dark (inherits currentColor). Minimum 20px.
 */
export function BrandIcon({
  name,
  size = 24,
  className,
  title,
}: {
  name: BrandIconName;
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {BRAND_ICONS[name].map((el, i) =>
        el.kind === "stroke" ? (
          <path key={i} d={el.d} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path key={i} d={el.d} fill={el.kind === "node" ? "#FF5200" : "currentColor"} />
        ),
      )}
    </svg>
  );
}
