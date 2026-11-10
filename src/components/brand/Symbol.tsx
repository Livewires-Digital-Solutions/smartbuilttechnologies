import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { SYMBOL_LOCKUP } from "./logo-data";

/**
 * Devices built from the SBT symbol (Graphic Language p.2–7). Only the symbol
 * paths are imported here, so these stay small enough for client bundles.
 */

type PartName = "foundation" | "digital" | "precision" | "integration";
const PARTS: PartName[] = ["foundation", "digital", "precision", "integration"];
const VB = SYMBOL_LOCKUP.viewBox;

const COLOURS: Record<Exclude<PartName, "foundation">, string> = {
  digital: "#1D6BF3",
  precision: "#7CC0FA",
  integration: "#FF5200",
};

function useGradientId() {
  return `sg-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function FoundationGradient({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#0C1446" />
        <stop offset="1" stopColor="#1E64F0" />
      </linearGradient>
    </defs>
  );
}

/* -------------------------------------------------------------------------- */
/* ExplodedSymbol — the four pathways as separate layers on the 30° axis.     */
/* Assembles once on load (orange arrives last) and drifts apart on scroll.  */
/* Pure CSS: see `.xs-*` rules in globals.css.                                */
/* -------------------------------------------------------------------------- */

export function ExplodedSymbol({
  tone = "full",
  className,
  assemble = true,
  drift = false,
}: {
  tone?: "full" | "inverse";
  className?: string;
  /** Play the assemble animation on first paint */
  assemble?: boolean;
  /** Separate the layers as the page scrolls */
  drift?: boolean;
}) {
  const gid = useGradientId();
  return (
    <svg
      viewBox={VB}
      className={cn("overflow-visible", assemble && "xs-assemble", drift && "xs-drift", className)}
      aria-hidden="true"
      focusable="false"
    >
      <FoundationGradient id={gid} />
      {PARTS.map((part, i) => (
        <g key={part} className={`xs-part xs-${part}`} style={{ "--i": i } as CSSProperties}>
          <path
            d={SYMBOL_LOCKUP.parts[part]}
            fill={part === "foundation" ? (tone === "inverse" ? "#FFFFFF" : `url(#${gid})`) : COLOURS[part]}
          />
        </g>
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* SymbolCrop — an oversized fragment bleeding off an edge (device A).        */
/* -------------------------------------------------------------------------- */

export type CropTone = "full" | "inverse" | "ghost-white" | "ghost-navy";

export function SymbolCrop({ tone = "full", className }: { tone?: CropTone; className?: string }) {
  const gid = useGradientId();
  const ghost = tone === "ghost-white" || tone === "ghost-navy";
  return (
    <svg
      viewBox={VB}
      className={cn("pointer-events-none select-none", className)}
      aria-hidden="true"
      focusable="false"
    >
      {!ghost && <FoundationGradient id={gid} />}
      <g
        fill={tone === "ghost-white" ? "#FFFFFF" : tone === "ghost-navy" ? "#0C1446" : undefined}
        opacity={tone === "ghost-white" ? 0.12 : tone === "ghost-navy" ? 0.07 : undefined}
      >
        {PARTS.map((part) => (
          <path
            key={part}
            d={SYMBOL_LOCKUP.parts[part]}
            fill={
              ghost
                ? undefined
                : part === "foundation"
                  ? tone === "inverse"
                    ? "#FFFFFF"
                    : `url(#${gid})`
                  : COLOURS[part]
            }
          />
        ))}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* PathwayGlyph — the symbol with one pathway lit, the rest quiet.            */
/* -------------------------------------------------------------------------- */

const PATHWAY_PART: Record<string, PartName> = {
  foundation: "foundation",
  precision: "precision",
  "digital-layer": "digital",
  integration: "integration",
};

export function PathwayGlyph({
  pathway,
  surface = "light",
  className,
}: {
  pathway: "foundation" | "precision" | "digital-layer" | "integration";
  surface?: "light" | "dark";
  className?: string;
}) {
  const gid = useGradientId();
  const lit = PATHWAY_PART[pathway];
  const quiet = surface === "dark" ? "rgb(255 255 255 / 0.14)" : "#E3E7EF";
  return (
    <svg viewBox={VB} className={cn("shrink-0", className)} aria-hidden="true" focusable="false">
      <FoundationGradient id={gid} />
      {PARTS.map((part) => (
        <path
          key={part}
          d={SYMBOL_LOCKUP.parts[part]}
          fill={
            part !== lit
              ? quiet
              : part === "foundation"
                ? surface === "dark"
                  ? "#FFFFFF"
                  : `url(#${gid})`
                : COLOURS[part]
          }
        />
      ))}
    </svg>
  );
}
