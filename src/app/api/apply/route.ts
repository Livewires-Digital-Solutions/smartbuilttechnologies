import { after, NextResponse } from "next/server";
import { GENERAL_POSITIONS } from "@/content/careers";
import { createApplication, recentDuplicate } from "@/lib/applications";
import { dbConfigured } from "@/lib/db";
import { getApplyableJob } from "@/lib/jobs";
import { sendApplicationMails } from "@/lib/mail";
import { allow, clientIp, hashIp } from "@/lib/rate-limit";
import {
  readCv,
  removeCv,
  saveCv,
  UploadError,
  validateCv,
} from "@/lib/uploads";

/**
 * Receives an application (multipart form with the CV). It checks everything again on
 * the server, saves the CV to disk and the application to MySQL, then emails the hiring
 * team and the applicant without making the applicant wait for the mail server.
 */

/** One address only: no spaces, brackets, commas or quotes that could smuggle in a second recipient. */
const EMAIL = /^[^\s@<>(),;:"\\]+@[^\s@<>(),;:"\\]+\.[^\s@<>(),;:"\\]{2,}$/;

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  try {
    return await handle(request);
  } catch (e) {
    // for example the database is down: say so plainly instead of a broken page
    console.error("[apply] unexpected failure:", e);
    return json(
      {
        ok: false,
        error:
          "We could not take your application right now. Please try again in a few minutes.",
      },
      500,
    );
  }
}

async function handle(request: Request) {
  if (!dbConfigured()) {
    return json(
      { ok: false, error: "Applications are not open on this site yet." },
      503,
    );
  }

  const ip = await clientIp();
  // per address and hour; shared connections (an office, a college) need room, so it is adjustable
  const perHour = Number(process.env.APPLY_RATE_LIMIT_PER_HOUR) || 10;
  if (!allow(`apply:${ip}`, perHour, 60 * 60 * 1000)) {
    return json(
      {
        ok: false,
        error:
          "Too many applications from this connection. Please try again later.",
      },
      429,
    );
  }

  // a CV is at most 5 MB, so anything much bigger is not a real application
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 7 * 1024 * 1024) {
    return json(
      {
        ok: false,
        error: "That upload is too large. Your CV must be 5 MB or less.",
      },
      413,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(
      { ok: false, error: "We could not read that form. Please try again." },
      400,
    );
  }

  // hidden field only bots fill in: answer as if it worked
  if (String(form.get("website") ?? "") !== "") return json({ ok: true });

  const text = (k: string) => String(form.get(k) ?? "").trim();
  // one line, no control characters: the name ends up in email headers and the CSV
  const name = text("name")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const email = text("email").toLowerCase();
  const code = text("code").replace(/[^\d+]/g, "");
  const phoneDigits = text("phone").replace(/[^\d]/g, "");
  const experience = text("experience");
  const message = text("message");
  const jobSlug = text("job");
  const general = text("position");
  const consent = form.get("consent") === "on";
  const file = form.get("cv");

  const fields: Record<string, string> = {};
  if (name.length < 2 || name.length > 120)
    fields.name = "Please enter your full name.";
  if (!EMAIL.test(email) || email.length > 254)
    fields.email = "Please enter a valid email address.";
  if (phoneDigits.length < 6 || phoneDigits.length > 15)
    fields.phone = "Please enter a valid phone number.";
  if (experience && !/^\d{1,2}(\.\d)?$/.test(experience))
    fields.experience = "Enter years as a number, for example 3 or 2.5.";
  if (message.length > 2000)
    fields.message = "Please keep the message under 2000 characters.";
  if (!consent)
    fields.consent = "Please agree so we can process your application.";
  if (!(file instanceof File) || file.size === 0)
    fields.cv = "Please attach your CV.";

  // which role: an open job from its own page / the list, or one of the general positions
  let jobId: number | null = null;
  let position = "";
  if (jobSlug) {
    const job = await getApplyableJob(jobSlug);
    if (!job)
      fields.position =
        "That position is no longer open. Please choose another.";
    else {
      jobId = job.id;
      position = job.title;
    }
  } else if ((GENERAL_POSITIONS as readonly string[]).includes(general)) {
    position = general;
  } else {
    fields.position = "Please choose a position.";
  }

  if (file instanceof File && file.size > 0 && !fields.cv) {
    try {
      await validateCv(file);
    } catch (e) {
      fields.cv =
        e instanceof UploadError ? e.message : "We could not read that file.";
    }
  }

  if (Object.keys(fields).length) {
    return json(
      { ok: false, error: "Please check the highlighted fields.", fields },
      422,
    );
  }

  if (await recentDuplicate(email, jobId, position)) {
    return json(
      {
        ok: false,
        error:
          "You have already applied for this position in the last day. We have your application.",
      },
      409,
    );
  }

  let upload: Awaited<ReturnType<typeof saveCv>>;
  try {
    upload = await saveCv(file as File);
  } catch (e) {
    console.error("[apply] could not store the CV:", e);
    return json(
      {
        ok: false,
        error:
          "We could not save your application. Please try again in a moment.",
      },
      500,
    );
  }
  let id: number;
  try {
    id = await createApplication({
      jobId,
      position,
      name,
      email,
      phone: `${code} ${phoneDigits}`.trim().slice(0, 32),
      experienceYears: experience || null,
      message: message || null,
      cvPath: upload.path,
      cvName: upload.name,
      cvMime: upload.mime,
      cvSize: upload.size,
      ipHash: hashIp(ip),
    });
  } catch (e) {
    await removeCv(upload.path);
    console.error("[apply] could not save application:", e);
    return json(
      {
        ok: false,
        error:
          "We could not save your application. Please try again in a moment.",
      },
      500,
    );
  }

  // after the response is sent: a slow mail server must not make the applicant wait
  after(async () => {
    try {
      await sendApplicationMails({
        id,
        position,
        name,
        email,
        phone: `${code} ${phoneDigits}`.trim(),
        experienceYears: experience || null,
        message: message || null,
        cvName: upload.name,
        cv: await readCv(upload.path),
        cvMime: upload.mime,
      });
    } catch (e) {
      console.error("[apply] mail step failed:", e);
    }
  });

  return json({ ok: true });
}
