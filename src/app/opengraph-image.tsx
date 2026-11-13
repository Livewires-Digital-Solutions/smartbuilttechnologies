import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}: BIM and digital construction, the production firm of ${site.group}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The link-preview card for every page that has no picture of its own. */
export default async function OpenGraphImage() {
  const mark = await readFile(
    path.join(process.cwd(), "public/brand/sbt-favicon.svg"),
  );
  const src = `data:image/svg+xml;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0C1446",
        color: "#FFFFFF",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={96} height={96} alt="" />
        <div style={{ fontSize: 34, letterSpacing: 2, fontWeight: 700 }}>
          SMART BUILT TECHNOLOGIES
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 76,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: -2,
            display: "flex",
          }}
        >
          BIM, scan to BIM and digital twin services.
        </div>
        <div style={{ fontSize: 32, color: "#B9C4F2", display: "flex" }}>
          The production firm of {site.group}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: 8,
          width: 160,
          background: "#FF5200",
        }}
      />
    </div>,
    size,
  );
}
