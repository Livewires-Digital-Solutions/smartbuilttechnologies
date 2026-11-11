#!/usr/bin/env node
/**
 * Downloads TXG group assets (txgksa.com) into /public/assets with kebab-case names.
 * Usage: node scripts/migrate-assets.mjs [--force]
 *
 * Every file is checked for a real image/PDF signature before it is written,
 * so an HTML error page can never land in /public as an "image".
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://txgksa.com";
const OUT = path.resolve(import.meta.dirname, "..", "public", "assets");
const force = process.argv.includes("--force");

const kebab = (s) =>
  s
    .replace(/\.(jpg|jpeg|png|webp|pdf)(\.(jpg|jpeg|png|webp))?$/i, "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

/** [remote path, local folder] */
const PROJECTS = [
  "Airtrunk_Shell_HJKL.webp", "Al_Moosa_Rehabilitation_Hospital.jpg", "Al_Nahda_Entertainment_Complex.webp",
  "Banksia_CSL.webp", "Chadstone_Shopping_Center.webp", "Geelong_Convention_Event_Center.webp",
  "Hegra_Boutique_Hotel.webp", "Jeddah_Opera_House.jpg", "Jeddah_Tower.jpg",
  "King_Abdulaziz_International_Airport.webp", "King_Abdullah_Financial_District.webp", "King_Salman_Park.webp",
  "Melbourne_Airport.webp", "Microsoft_Data_Center_MEL07.webp", "NEOM_Bay_Airport_T1_T2.jpg", "NEOM_Oxagon.jpg",
  "Riyadh_Metro.webp", "Shura_HC1_The_Tail_Marsa_Village.jpg", "Six_Senses_Hotel_Wadi_Safar.jpg",
  "Sports_Boulevard.webp", "Tadawul_Tower.webp", "Thomas_Embling_Hospital.webp",
].map((f) => [`/assets/projects/${f}`, "projects"]);

const CLIENTS = [
  "Al_Bhawani", "Al_Moosa", "Baumat", "CCE", "First_Fix", "HATCO", "HUTA", "ICAD", "IFAS", "Jeddah_Central",
  "KAFD", "MBL", "MIDAD", "NEOM", "NESMA", "RSG", "Red_Sea_Global", "SP", "Samsung", "Sevens",
].map((f) => [`/assets/clients/${f}.png`, "clients"]);

const PARTNERS = Array.from({ length: 11 }, (_, i) => [
  `/assets/technology_partners/partner_${String(i + 1).padStart(2, "0")}.png`,
  "partners",
]);

const CERTS = [
  ["ISO CERTIFICATIONS.png", "iso-27001"],
  ["ISO CERTIFICATIONS 2.png", "iso-9001"],
  ["ISO CERTIFICATION 3.png", "iso-45001"],
  ["ISO CERTIFICATION 4.png", "iso-14001"],
].map(([f, name]) => [`/assets/txg-certificates/${f}`, "certificates", name]);

const EVENTS = [
  "Saudi_Airport_Exhibition_2024/Saudi_Airport_Exhibition_2024.jpg",
  "Saudi_Airport_Exhibition_2023/Saudi_Airport_Exhibition_2023.jpg",
  "TXG_10th_Anniversary_Riyadh/10th_Anniversary_Event_Riyadh.jpg",
  "Autodesk_Technology_Day/Autodesk_Technology_Day.jpg",
  "TXG_10th_Anniversary_Kozhikode/10th_Anniversary_Event_Kozhikode.jpg",
  "World_Defense_Show/World_Defense_Show_2024.webp",
  "Construction_Tech_Confex/Construction_Technology_Confex_KSA_2024.jpg",
  "IFSEC_International_2023/IFSEC_International_2023.jpg",
  "IFSEC_Office_Inaugurations/Office_Inauguration_Cyberpark.jpg",
].map((f) => [`/assets/events/${f}`, "events"]);

const SERVICES = [
  ["BIM stock.jpg.jpeg", "bim"], ["Reality Capture.jpg.jpeg", "reality-capture"],
  ["Asset management.png", "asset-management"], ["CAFM.jpeg", "cafm"], ["Digital Twin.jpeg", "digital-twin"],
  ["GIS.jpeg", "gis-smart-cities"], ["IT.jpeg", "it-services"],
].map(([f, name]) => [`/assets/service-bg/${f}`, "services", name]);

const MISC = [
  ["/assets/background-images/herobg.webp", "misc", "hero-architecture"],
  ["/assets/homepage/other/BIM_Advantage_section.jpg", "misc", "team-at-work"],
  ["/uploads/blogs/acb31848-a3bf-487d-a45c-d8cf1e088794_1792738950995.jpg", "blog", "scan-to-bim-process-accuracy-deliverables"],
];

const ALL = [...PROJECTS, ...CLIENTS, ...PARTNERS, ...CERTS, ...EVENTS, ...SERVICES, ...MISC];

const SIGNATURES = [
  { ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 },
  { ext: "png", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { ext: "webp", test: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
  { ext: "pdf", test: (b) => b.subarray(0, 4).toString() === "%PDF" },
];

const exists = (p) => access(p).then(() => true, () => false);

let ok = 0;
let skipped = 0;
const failed = [];

for (const [remote, folder, name] of ALL) {
  const base = name ?? kebab(path.basename(remote));
  const url = ORIGIN + remote.split("/").map(encodeURIComponent).join("/");
  try {
    const res = await fetch(url, { headers: { "User-Agent": "sbt-asset-migration/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const sig = SIGNATURES.find((s) => s.test(buf));
    if (!sig) throw new Error("not a recognised image/PDF");
    const dir = path.join(OUT, folder);
    const file = path.join(dir, `${base}.${sig.ext}`);
    if (!force && (await exists(file))) {
      skipped++;
      continue;
    }
    await mkdir(dir, { recursive: true });
    await writeFile(file, buf);
    ok++;
    console.log(`✓ ${folder}/${base}.${sig.ext}  ${(buf.length / 1024).toFixed(0)} KB`);
  } catch (err) {
    failed.push(`${remote} — ${err.message}`);
  }
}

console.log(`\n${ok} downloaded, ${skipped} already present, ${failed.length} failed`);
if (failed.length) {
  console.log(failed.map((f) => `✗ ${f}`).join("\n"));
  process.exitCode = 1;
}
