import { B, COLOURS, type ActiveLayer } from "./geometry";

/**
 * Static isometric drawing of the hero building on the brand's 30° grid.
 * It is the server-rendered image (no layout shift, works without JavaScript),
 * the fallback when WebGL is unavailable or motion is reduced, and the
 * placeholder while the 3D scene loads.
 */

const S = 62;
const C = Math.cos(Math.PI / 6);
const OX = 300;
const OY = 372;
type V3 = [number, number, number];
const P = ([x, y, z]: V3): [number, number] => [OX + (x - y) * C * S, OY + (x + y) * 0.5 * S - z * S];
const poly = (...ps: V3[]) => ps.map((p) => P(p).map((n) => n.toFixed(1)).join(",")).join(" ");

const { W, D, H, T, FLOORS } = B;
const zf = (f: number) => f * H;

const scanDots = (() => {
  const out: { x: number; y: number; dev: boolean }[] = [];
  const jitter = (n: number) => Math.sin(n * 12.9898) * 0.012;
  for (let f = 0; f < FLOORS - 1; f++) {
    const z0 = zf(f) + T + 0.1;
    const z1 = zf(f + 1) - 0.06;
    for (let z = z0; z <= z1; z += 0.17) {
      for (let y = 0.1; y <= D - 0.05; y += 0.22) {
        const dev = f === 1 && y > 1.2 && y < 1.75 && z > z0 + 0.25 && z < z0 + 0.62;
        const [sx, sy] = P([W + jitter(y * z), y, z]);
        out.push({ x: sx, y: sy, dev });
      }
      for (let x = 0.1; x <= W - 0.05; x += 0.22) {
        const [sx, sy] = P([x, D + jitter(x + z), z]);
        out.push({ x: sx, y: sy, dev: false });
      }
    }
  }
  return out;
})();

const cols: [number, number][] = [
  [0, 0], [W, 0], [0, D], [W / 2, 0], [0, D / 2], [W, D / 2], [W / 2, D], [W, D],
];
const sensors: V3[] = Array.from({ length: FLOORS }, (_, f) => [W - 0.55, D - 0.55, zf(f) + T]);
const cloud: V3 = [W - 0.55, D - 0.55, zf(FLOORS - 1) + T + 1.35];
const tags: V3[] = [];
for (let f = 0; f < FLOORS; f++) {
  const z = zf(f) + T;
  tags.push([W - 0.45, 0.55, z], [W - 0.45, 1.5, z], [W - 0.45, 2.2, z], [0.7, D - 0.45, z], [1.7, D - 0.45, z]);
}

export function BuildingPoster({ active = "all", className }: { active?: ActiveLayer; className?: string }) {
  const on = (n: 0 | 1 | 2 | 3, rest = 0) => (active === "all" || active === n ? 1 : rest);
  const [cx, cy] = P(cloud);
  const [s0x, s0y] = P(sensors[0]!);
  const dev = scanDots.find((d) => d.dev);

  return (
    <svg
      viewBox="-10 -10 720 680"
      role="img"
      aria-label="Isometric drawing of a four-storey building showing four layers: BIM model, scan points, connected sensors and tagged assets"
      className={className}
    >
      <g stroke="#CBD2DF" strokeWidth="1" fill="none">
        {Array.from({ length: 8 }, (_, i) => (
          <polyline key={`a${i}`} points={poly([-0.5 + i * 0.6, -0.5, 0], [-0.5 + i * 0.6, D + 0.6, 0])} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <polyline key={`b${i}`} points={poly([-0.5, -0.5 + i * 0.6, 0], [W + 0.7, -0.5 + i * 0.6, 0])} />
        ))}
      </g>

      <g style={{ opacity: on(0, 0.3), transition: "opacity 500ms" }}>
        {Array.from({ length: FLOORS }, (_, f) => {
          const z0 = zf(f);
          const z1 = z0 + T;
          return (
            <g key={f}>
              {f > 0 &&
                cols.map(([x, y], k) => (
                  <polyline key={k} points={poly([x, y, zf(f - 1) + T], [x, y, z0])} fill="none" stroke={COLOURS.navy} strokeWidth="4" opacity="0.82" />
                ))}
              <polygon points={poly([W, 0, z0], [W, D, z0], [W, D, z1], [W, 0, z1])} fill="#9EA1B5" stroke={COLOURS.navy} strokeWidth="1.2" />
              <polygon points={poly([0, D, z0], [W, D, z0], [W, D, z1], [0, D, z1])} fill="#CED0DA" stroke={COLOURS.navy} strokeWidth="1.2" />
              <polygon points={poly([0, 0, z1], [W, 0, z1], [W, D, z1], [0, D, z1])} fill={COLOURS.paper} stroke={COLOURS.navy} strokeWidth="1.5" />
            </g>
          );
        })}
      </g>

      <g style={{ opacity: on(1), transition: "opacity 500ms" }}>
        {scanDots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.dev ? 2.5 : 1.8} fill={d.dev ? COLOURS.orange : COLOURS.sky} />
        ))}
        {dev ? (
          <g>
            <polyline points={`${dev.x + 22},${dev.y - 6} ${dev.x + 66},${dev.y - 46} ${dev.x + 104},${dev.y - 46}`} fill="none" stroke={COLOURS.navy} strokeWidth="1" />
            <text x={dev.x + 108} y={dev.y - 42} fontSize="11" fill={COLOURS.navy} style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Differs from model
            </text>
          </g>
        ) : null}
      </g>

      <g style={{ opacity: on(2), transition: "opacity 500ms" }}>
        <polyline points={poly(sensors[0]!, [sensors[0]![0], sensors[0]![1], cloud[2]])} fill="none" stroke={COLOURS.cobalt} strokeWidth="1.6" strokeDasharray="4 4" />
        {sensors.map((s, f) => {
          const [sx, sy] = P(s);
          return (
            <g key={f}>
              <circle cx={sx} cy={sy} r="10" fill="none" stroke={COLOURS.cobalt} strokeWidth="1.5" opacity="0.45" />
              <circle cx={sx} cy={sy} r="4.6" fill={COLOURS.cobalt} />
            </g>
          );
        })}
        <rect x={cx - 46} y={cy - 26} width="92" height="52" rx="8" fill="#FFFFFF" stroke={COLOURS.cobalt} strokeWidth="1.6" />
        {[14, 24, 18, 32].map((h, i) => (
          <rect key={i} x={cx - 32 + i * 16} y={cy + 16 - h} width="10" height={h} rx="1.5" fill={COLOURS.cobalt} opacity={0.5 + i * 0.16} />
        ))}
        <circle cx={s0x} cy={s0y} r="0" />
      </g>

      <g style={{ opacity: on(3), transition: "opacity 500ms" }}>
        {tags.map((t, i) => {
          const q = 0.26;
          const z = t[2];
          return (
            <g key={i}>
              <polygon points={poly([t[0], t[1], z], [t[0] + q, t[1], z], [t[0] + q, t[1] + q, z], [t[0], t[1] + q, z])} fill={COLOURS.orange} />
              <polygon points={poly([t[0] + 0.07, t[1] + 0.07, z], [t[0] + q - 0.07, t[1] + 0.07, z], [t[0] + q - 0.07, t[1] + q - 0.07, z], [t[0] + 0.07, t[1] + q - 0.07, z])} fill="#FFFFFF" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
