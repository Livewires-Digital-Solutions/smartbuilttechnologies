import { cn } from "@/lib/cn";

export type RouteStop = 0 | 1 | 2;
export type RouteActive = "all" | RouteStop;

export const STOPS = [
  { key: "riyadh", city: "Riyadh", lat: 24.71, lon: 46.68, colour: "var(--color-navy)" },
  { key: "sharjah", city: "Sharjah", lat: 25.35, lon: 55.39, colour: "var(--color-cobalt)" },
  { key: "chennai", city: "Chennai", lat: 13.08, lon: 80.27, colour: "var(--color-orange)" },
] as const;

const W = 460;
const H = 580;
const LON0 = 44;
const LON1 = 82;
const LAT0 = 8;
const LAT1 = 30;
const px = (lon: number) => 20 + ((lon - LON0) / (LON1 - LON0)) * (W - 40);
const py = (lat: number) => 40 + ((LAT1 - lat) / (LAT1 - LAT0)) * (H - 60);

/** Great-circle distance in km, rounded to the nearest 100. */
const km = (a: (typeof STOPS)[number], b: (typeof STOPS)[number]) => {
  const r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r;
  const dLon = (b.lon - a.lon) * r;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return Math.round((2 * 6371 * Math.asin(Math.sqrt(h))) / 100) * 100;
};

const P = STOPS.map((s) => ({ x: px(s.lon), y: py(s.lat) }));
const mid = (i: number, j: number) => ({
  x: (P[i]!.x + P[j]!.x) / 2,
  y: (P[i]!.y + P[j]!.y) / 2,
});
const ARCS = [
  {
    // Riyadh to Sharjah: a low arc over the top
    c: { x: mid(0, 1).x, y: Math.min(P[0]!.y, P[1]!.y) - 70 },
    label: km(STOPS[0], STOPS[1]),
  },
  {
    // Sharjah to Chennai: a long arc, bowed up and to the right
    c: { x: mid(1, 2).x + 70, y: mid(1, 2).y - 120 },
    label: km(STOPS[1], STOPS[2]),
  },
].map((a, i) => {
  const from = P[i]!;
  const to = P[i + 1]!;
  // the curve's midpoint (t = 0.5) is where the distance label sits
  const m = {
    x: 0.25 * from.x + 0.5 * a.c.x + 0.25 * to.x,
    y: 0.25 * from.y + 0.5 * a.c.y + 0.25 * to.y,
  };
  return {
    d: `M${from.x} ${from.y} Q${a.c.x} ${a.c.y} ${to.x} ${to.y}`,
    label: a.label,
    lx: m.x + (i === 1 ? 14 : 0),
    ly: m.y - 10,
    anchor: i === 1 ? ("start" as const) : ("middle" as const),
  };
});

/** Where each place's name sits, so the names never meet. */
const LABELS = {
  riyadh: { dx: -4, dy: 40, anchor: "start" },
  sharjah: { dx: 4, dy: -36, anchor: "start" },
  chennai: { dx: -22, dy: 6, anchor: "end" },
} as const;

const lons = [45, 50, 55, 60, 65, 70, 75, 80];
const lats = [10, 15, 20, 25, 30];
const coord = (v: number, n: "N" | "E") => `${v}°${n}`;

/**
 * A technical drawing of the group: a graticule, the three places the group works
 * from, and the routes between them. Positions are real coordinates. `active`
 * focuses one place (the others dim); "all" shows the whole route.
 */
export function GroupRoute({
  active,
  className,
}: {
  active: RouteActive;
  className?: string;
}) {
  const live = (arc: 0 | 1) => active === "all" || active >= arc + 1;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Map of the group: Riyadh, Sharjah and Chennai, connected by routes"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke="rgb(12 20 70 / 0.12)" strokeWidth="1" strokeDasharray="2 5">
        {lons.map((l) => (
          <line key={l} x1={px(l)} y1={30} x2={px(l)} y2={H - 20} />
        ))}
        {lats.map((l) => (
          <line key={l} x1={10} y1={py(l)} x2={W - 10} y2={py(l)} />
        ))}
      </g>
      <g
        fontFamily="var(--font-mono)"
        fontSize="9"
        fill="rgb(61 67 107 / 0.8)"
        letterSpacing="0.06em"
      >
        {lons.map((l) => (
          <text key={l} x={px(l)} y={22} textAnchor="middle">
            {coord(l, "E")}
          </text>
        ))}
        {lats.map((l) => (
          <text key={l} x={10} y={py(l) - 5}>
            {coord(l, "N")}
          </text>
        ))}
      </g>

      {ARCS.map((a, i) => (
        <g key={i}>
          <path d={a.d} fill="none" stroke="rgb(12 20 70 / 0.18)" strokeWidth="1.5" strokeDasharray="3 6" />
          <path
            d={a.d}
            fill="none"
            stroke="var(--color-navy)"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={live(i as 0 | 1) ? 0 : 1}
            style={{ transition: "stroke-dashoffset 1100ms var(--ease-out)" }}
          />
          <text
            x={a.lx}
            y={a.ly}
            textAnchor={a.anchor}
            fontFamily="var(--font-mono)"
            fontSize="10"
            letterSpacing="0.06em"
            fill="rgb(61 67 107)"
            style={{ opacity: live(i as 0 | 1) ? 1 : 0, transition: "opacity 600ms 500ms" }}
          >
            ≈ {a.label.toLocaleString("en-US")} KM
          </text>
        </g>
      ))}

      {STOPS.map((s, i) => {
        const on = active === i;
        const dim = active !== "all" && !on;
        const place = LABELS[s.key];
        const fill = s.colour;
        return (
          <g
            key={s.key}
            style={{ opacity: dim ? 0.45 : 1, transition: "opacity 400ms var(--ease-out)" }}
          >
            {on ? (
              <rect
                x={P[i]!.x - 14}
                y={P[i]!.y - 14}
                width="28"
                height="28"
                rx="6"
                fill="none"
                stroke={s.colour}
                strokeWidth="1.5"
                className="route-ping"
              />
            ) : null}
            <rect
              x={P[i]!.x - 8}
              y={P[i]!.y - 8}
              width="16"
              height="16"
              rx="4"
              fill={fill}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                transform: on ? "scale(1.4)" : "scale(1)",
                transition: "transform 300ms var(--ease-out), fill 300ms",
              }}
            />
            <text
              x={P[i]!.x + place.dx}
              y={P[i]!.y + place.dy}
              textAnchor={place.anchor}
              fontSize="28"
              fontWeight="500"
              letterSpacing="-0.04em"
              fill="var(--color-navy)"
            >
              {s.city}
            </text>
            <text
              x={P[i]!.x + place.dx}
              y={P[i]!.y + place.dy + 17}
              textAnchor={place.anchor}
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="0.06em"
              fill="rgb(61 67 107)"
            >
              {coord(Math.abs(Math.round(s.lat * 100) / 100), "N")} · {coord(Math.round(s.lon * 100) / 100, "E")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
