"use client";

import { useId, useRef, useState, type DragEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Typography";
import { CV_ACCEPT, CV_MAX_MB, GENERAL_POSITIONS } from "@/content/careers";
import { countryCodes, defaultCountryCode } from "@/content/country-codes";
import { cn } from "@/lib/cn";

export interface ApplyJob {
  slug: string;
  title: string;
}

type Errors = Partial<
  Record<
    | "name"
    | "email"
    | "phone"
    | "position"
    | "experience"
    | "message"
    | "cv"
    | "consent",
    string
  >
>;

const field =
  "w-full border-0 border-b border-white/30 bg-transparent pb-3 text-[1.0625rem] text-white placeholder:text-white/40 focus:border-orange focus:outline-none aria-[invalid=true]:border-orange";

const sizeLabel = (n: number) =>
  n < 1024 * 1024
    ? `${Math.max(1, Math.round(n / 1024))} KB`
    : `${(n / 1024 / 1024).toFixed(1)} MB`;

/**
 * The application form, set for the navy band. Used on the careers page (with every
 * open position to choose from, plus the general positions) and on a job's own page
 * (`fixed`, so the position is already decided). The CV is dropped or chosen, checked
 * here for a quick answer and checked again on the server.
 */
export function ApplyForm({
  jobs,
  fixed,
}: {
  jobs: ApplyJob[];
  /** On a job page: the position is this job and the choice is hidden. */
  fixed?: ApplyJob;
}) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [failure, setFailure] = useState("");

  const pickFile = (f: File | null) => {
    setFile(f);
    setErrors((e) => ({ ...e, cv: undefined }));
  };

  const checkFile = (f: File): string | null => {
    if (!/\.(pdf|docx?)$/i.test(f.name))
      return "Please upload a PDF, DOC or DOCX file.";
    if (f.size > CV_MAX_MB * 1024 * 1024)
      return `The file is larger than ${CV_MAX_MB} MB.`;
    if (f.size === 0) return "The file is empty.";
    return null;
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const problem = checkFile(f);
    if (problem) {
      setFile(null);
      setErrors((x) => ({ ...x, cv: problem }));
    } else pickFile(f);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sending") return;
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    const next: Errors = {};
    if (text("name").length < 2) next.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(text("email")))
      next.email = "Please enter a valid email address.";
    const digits = text("phone").replace(/\D/g, "");
    if (digits.length < 6 || digits.length > 15)
      next.phone = "Please enter a valid phone number.";
    if (!fixed && !text("choice")) next.position = "Please choose a position.";
    if (text("experience") && !/^\d{1,2}(\.\d)?$/.test(text("experience")))
      next.experience = "Enter years as a number, for example 3 or 2.5.";
    if (!file) next.cv = "Please attach your CV.";
    else {
      const problem = checkFile(file);
      if (problem) next.cv = problem;
    }
    if (f.get("consent") !== "on")
      next.consent = "Please agree so we can process your application.";
    setErrors(next);
    setFailure("");
    const first = Object.keys(next)[0];
    if (first) {
      const target =
        first === "cv"
          ? fileRef.current
          : (e.currentTarget.elements.namedItem(
              first === "position" ? "choice" : first,
            ) as HTMLElement | null);
      target?.focus();
      return;
    }

    const body = new FormData();
    for (const k of [
      "name",
      "email",
      "code",
      "phone",
      "experience",
      "message",
      "website",
    ]) {
      body.set(k, String(f.get(k) ?? ""));
    }
    const choice = fixed ? `job:${fixed.slug}` : text("choice");
    if (choice.startsWith("job:")) body.set("job", choice.slice(4));
    else body.set("position", choice.slice(4));
    body.set("consent", "on");
    body.set("cv", file!);

    setState("sending");
    try {
      const res = await fetch("/api/apply", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: Errors;
      };
      if (res.ok && data.ok) {
        setState("done");
        return;
      }
      setErrors(data.fields ?? {});
      setFailure(data.error ?? "Something went wrong. Please try again.");
      setState("idle");
    } catch {
      setFailure(
        "We could not reach the server. Check your connection and try again.",
      );
      setState("idle");
    }
  };

  const reset = () => {
    formRef.current?.reset();
    setFile(null);
    setErrors({});
    setFailure("");
    setState("idle");
  };

  if (state === "done") {
    return (
      <div
        role="status"
        className="flex flex-col gap-5 border-t border-white/25 pt-6"
      >
        <Label className="text-sky">Application received</Label>
        <p className="text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance">
          Thank you. We have your application.
        </p>
        <p className="max-w-[46ch] text-white/75">
          A confirmation is on its way to your email. Our hiring team reads
          every CV, and if your profile matches, we will be in touch.
        </p>
        <div>
          <button
            type="button"
            onClick={reset}
            className="font-semibold text-white underline underline-offset-[5px]"
          >
            {fixed ? "Send another application" : "Apply for another position"}
          </button>
        </div>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span
        id={`${id}-${k}-err`}
        role="alert"
        className="text-[0.875rem] text-orange"
      >
        {errors[k]}
      </span>
    ) : null;
  const aria = (k: keyof Errors) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined,
  });

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-label="Job application"
      className="flex flex-col gap-9"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] opacity-0"
      />

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">
          <label htmlFor={`${id}-name`}>Full Name</label>
        </Label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          placeholder="Full Name"
          className={field}
          {...aria("name")}
        />
        {err("name")}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">
          <label htmlFor={`${id}-email`}>Email Address</label>
        </Label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="Email Address"
          className={field}
          {...aria("email")}
        />
        {err("email")}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">
          <label htmlFor={`${id}-phone`}>Phone Number</label>
        </Label>
        <div className="flex items-end gap-3">
          <select
            name="code"
            aria-label="Country code"
            defaultValue={defaultCountryCode}
            className={cn(
              field,
              "w-[7.25rem] shrink-0 cursor-pointer text-[1rem]",
            )}
          >
            {countryCodes.map((c) => (
              <option
                key={`${c.flag}${c.code}`}
                value={c.code}
                className="bg-navy text-white"
              >
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel-national"
            maxLength={20}
            placeholder="Phone Number"
            className={field}
            {...aria("phone")}
          />
        </div>
        {err("phone")}
      </div>

      {fixed ? (
        <div className="flex flex-col gap-2">
          <Label className="text-white/70">Position</Label>
          <p className="border-b border-white/30 pb-3 text-[1.0625rem] font-medium">
            {fixed.title}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Label className="text-white/70">
            <label htmlFor={`${id}-choice`}>Select Position</label>
          </Label>
          <select
            id={`${id}-choice`}
            name="choice"
            defaultValue=""
            className={cn(field, "cursor-pointer")}
            {...aria("position")}
          >
            <option value="" className="bg-navy text-white">
              Select Position
            </option>
            {jobs.length > 0 ? (
              <optgroup label="Open positions" className="bg-navy text-white">
                {jobs.map((j) => (
                  <option
                    key={j.slug}
                    value={`job:${j.slug}`}
                    className="bg-navy text-white"
                  >
                    {j.title}
                  </option>
                ))}
              </optgroup>
            ) : null}
            <optgroup
              label="General application"
              className="bg-navy text-white"
            >
              {GENERAL_POSITIONS.map((p) => (
                <option
                  key={p}
                  value={`gen:${p}`}
                  className="bg-navy text-white"
                >
                  {p}
                </option>
              ))}
            </optgroup>
          </select>
          {err("position")}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">
          <label htmlFor={`${id}-experience`}>
            Total experience in years (optional)
          </label>
        </Label>
        <input
          id={`${id}-experience`}
          name="experience"
          type="text"
          inputMode="decimal"
          maxLength={4}
          placeholder="For example 3"
          className={field}
          {...aria("experience")}
        />
        {err("experience")}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">
          <label htmlFor={`${id}-message`}>Message (optional)</label>
        </Label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="Anything we should know"
          className={cn(field, "resize-none")}
          {...aria("message")}
        />
        {err("message")}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">Resume</Label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-start gap-3 border border-dashed p-5 transition-colors",
            dragging ? "border-orange bg-white/8" : "border-white/35",
            errors.cv && "border-orange",
          )}
        >
          <input
            ref={fileRef}
            id={`${id}-cv`}
            type="file"
            accept={CV_ACCEPT}
            className="sr-only"
            aria-label="Resume file"
            aria-invalid={!!errors.cv}
            aria-describedby={errors.cv ? `${id}-cv-err` : undefined}
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              if (!f) return;
              const problem = checkFile(f);
              if (problem) {
                setFile(null);
                setErrors((x) => ({ ...x, cv: problem }));
                e.target.value = "";
              } else pickFile(f);
            }}
          />
          {file ? (
            <div className="flex w-full items-center justify-between gap-4">
              <span className="min-w-0">
                <span className="block truncate font-medium">{file.name}</span>
                <span className="font-mono text-overline text-white/70 uppercase">
                  {sizeLabel(file.size)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  pickFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="shrink-0 font-semibold text-white underline underline-offset-[5px]"
              >
                Remove
              </button>
            </div>
          ) : (
            <p>
              Drag &amp; Drop Resume
              <span className="text-white/70"> or </span>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="font-semibold text-white underline underline-offset-[5px]"
              >
                Browse Files
              </button>
            </p>
          )}
          <p className="flex w-full items-center justify-between gap-4 font-mono text-overline text-white/70 uppercase">
            <span>PDF, DOC, DOCX — Max {CV_MAX_MB} MB</span>
            <span>{file ? 1 : 0}/1 Uploaded</span>
          </p>
        </div>
        {err("cv")}
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 text-[0.9375rem] text-white/80">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 size-4 shrink-0 accent-orange"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? `${id}-consent-err` : undefined}
          />
          <span>
            I agree that Smart Built Technologies may store my details and CV to
            process my application and contact me about it.
          </span>
        </label>
        {err("consent")}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <Button type="submit" variant="signal" disabled={state === "sending"}>
            {state === "sending" ? "Submitting…" : "Submit Application"}
          </Button>
        </div>
        <p
          aria-live="polite"
          className={cn(
            "max-w-[46ch] text-[0.9375rem]",
            failure ? "text-orange" : "sr-only",
          )}
        >
          {failure}
        </p>
      </div>
    </form>
  );
}
