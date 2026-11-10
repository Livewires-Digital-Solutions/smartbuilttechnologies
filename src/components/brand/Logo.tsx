import { useId } from "react";
import { cn } from "@/lib/cn";
import {
  HORIZONTAL_LOCKUP,
  PRIMARY_LOCKUP,
  STACKED_LOCKUP,
  SYMBOL_LOCKUP,
  type LockupData,
  type LogoPart,
} from "./logo-data";

/**
 * The SBT logo, drawn from the vector artwork in Brand Guidelines v1.0.
 * Never rebuild, recolour, rotate, stretch or add effects (Brand Guidelines p.9).
 *
 * Tones (Brand Guidelines p.8):
 *  - full     full colour, for white or light backgrounds
 *  - inverse  white foundation and wordmark, for Midnight Navy
 *  - mono     one colour (currentColor), for stamps, etching and fax
 *
 * A parent can switch tone with `data-logo="inverse"` (see globals.css),
 * which is how the header flips over dark sections without re-rendering.
 */

const LOCKUPS = {
  primary: PRIMARY_LOCKUP,
  horizontal: HORIZONTAL_LOCKUP,
  stacked: STACKED_LOCKUP,
  symbol: SYMBOL_LOCKUP,
} satisfies Record<string, LockupData>;

export type LockupName = keyof typeof LOCKUPS;
export type LogoTone = "full" | "inverse" | "mono";

const FILL: Record<Exclude<LogoPart, "foundation" | "divider">, string> = {
  digital: "#1D6BF3",
  precision: "#7CC0FA",
  integration: "#FF5200",
  wordmark: "#0C1446",
  descriptor: "#0C1446",
};

const ORDER: LogoPart[] = ["foundation", "digital", "precision", "integration", "wordmark", "descriptor"];

interface LogoProps {
  lockup?: LockupName;
  tone?: LogoTone;
  className?: string;
  /** Accessible name. Pass `null` when the logo sits inside a link that already names it. */
  title?: string | null;
}

export function Logo({ lockup = "horizontal", tone = "full", className, title = "Smart Built Technologies" }: LogoProps) {
  const data = LOCKUPS[lockup];
  const gradientId = `lg-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [, , w, h] = data.viewBox.split(" ").map(Number);

  return (
    <svg
      viewBox={data.viewBox}
      width={w}
      height={h}
      className={cn("sbt-logo h-auto", className)}
      data-logo={tone === "full" ? undefined : tone}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0C1446" />
          <stop offset="1" stopColor="#1E64F0" />
        </linearGradient>
      </defs>
      {ORDER.map((part) => {
        const d = data.parts[part];
        if (!d) return null;
        const fill = part === "foundation" ? `url(#${gradientId})` : FILL[part as keyof typeof FILL];
        return <path key={part} className={`lg-${part}`} d={d} fill={fill} />;
      })}
      {data.parts.divider ? (
        <path
          className="lg-divider"
          d={data.parts.divider}
          fill="none"
          stroke="#CBD2DF"
          strokeWidth={data.dividerWidth ?? 0.72}
        />
      ) : null}
    </svg>
  );
}
