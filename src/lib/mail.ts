import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/content/site";

/**
 * Email through nodemailer over SMTP (SMTP_* in the environment). If SMTP_HOST is not
 * set, mail is skipped with a note in the server log, and applications are still saved.
 */

let transport: Transporter | null | undefined;

function mailer(): Transporter | null {
  if (transport !== undefined) return transport;
  const host = process.env.SMTP_HOST;
  if (!host) return (transport = null);
  transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
      : undefined,
    // a local relay on a private port may not have a certificate
    tls: { rejectUnauthorized: process.env.SMTP_INSECURE_TLS !== "true" },
  });
  return transport;
}

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

export interface ApplicationMail {
  id: number;
  position: string;
  name: string;
  email: string;
  phone: string;
  experienceYears: string | null;
  message: string | null;
  cvName: string;
  cv: Buffer;
  cvMime: string;
}

/**
 * Tells the hiring team (with the CV attached) and thanks the applicant. Never throws:
 * a mail problem is logged and must not lose an application that is already saved.
 */
export async function sendApplicationMails(a: ApplicationMail) {
  const t = mailer();
  if (!t) {
    console.warn(
      `[mail] SMTP is not configured; no email sent for application #${a.id}.`,
    );
    return;
  }
  const from =
    process.env.MAIL_FROM || `${site.name} <${site.contact.careersEmail}>`;
  const to = (process.env.HR_EMAIL || site.contact.careersEmail)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const admin = `${process.env.SITE_URL ?? site.url}/sys-ops/applications/${a.id}`;

  const details: [string, string][] = [
    ["Position", a.position],
    ["Name", a.name],
    ["Email", a.email],
    ["Phone", a.phone],
    ...(a.experienceYears
      ? ([["Experience", `${a.experienceYears} years`]] as [string, string][])
      : []),
  ];
  const text = [
    `New application #${a.id}`,
    "",
    ...details.map(([k, v]) => `${k}: ${v}`),
    ...(a.message ? ["", "Message:", a.message] : []),
    "",
    `Review it: ${admin}`,
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;color:#0c1446;line-height:1.5">
    <h2 style="margin:0 0 12px">New application #${a.id}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${details.map(([k, v]) => `<tr><td style="color:#555">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join("")}
    </table>
    ${a.message ? `<p style="white-space:pre-wrap;border-left:3px solid #ff5200;padding-left:12px">${esc(a.message)}</p>` : ""}
    <p><a href="${esc(admin)}">Review it in the admin area</a></p></div>`;

  try {
    await t.sendMail({
      from,
      to,
      replyTo: `${a.name} <${a.email}>`,
      subject: `New application: ${a.name}, ${a.position}`,
      text,
      html,
      attachments: [
        { filename: a.cvName, content: a.cv, contentType: a.cvMime },
      ],
    });
  } catch (e) {
    console.error(`[mail] could not notify the hiring team about #${a.id}:`, e);
  }

  try {
    await t.sendMail({
      from,
      to: a.email,
      subject: `We have received your application, ${a.position}`,
      text: [
        `Hello ${a.name},`,
        "",
        `Thank you for applying for ${a.position} at ${site.name}.`,
        "Our hiring team has your application and CV. If your profile matches, we will be in touch.",
        "",
        `${site.name}, the production firm of ${site.group}`,
      ].join("\n"),
      html: `<div style="font-family:Arial,sans-serif;color:#0c1446;line-height:1.55">
        <p>Hello ${esc(a.name)},</p>
        <p>Thank you for applying for <b>${esc(a.position)}</b> at ${esc(site.name)}.
        Our hiring team has your application and CV. If your profile matches, we will be in touch.</p>
        <p style="color:#555">${esc(site.name)}, the production firm of ${esc(site.group)}</p></div>`,
    });
  } catch (e) {
    console.error(
      `[mail] could not confirm application #${a.id} to the applicant:`,
      e,
    );
  }
}
