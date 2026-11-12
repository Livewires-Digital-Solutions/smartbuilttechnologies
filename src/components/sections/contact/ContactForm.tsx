"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Typography";
import { countryCodes, defaultCountryCode } from "@/content/country-codes";
import { cn } from "@/lib/cn";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const field =
  "w-full border-0 border-b border-white/30 bg-transparent pb-3 text-[1.0625rem] text-white placeholder:text-white/40 focus:border-orange focus:outline-none aria-[invalid=true]:border-orange";

/**
 * The enquiry form. There is no mail service behind the site yet, so Submit opens
 * the visitor's own mail app with the message already written, addressed to
 * `to`. That is stated on the page, so nobody thinks a message was sent when it was not.
 */
export function ContactForm({ to }: { to: string }) {
  const id = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [opened, setOpened] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("honeypot")) return; // a bot filled the hidden field
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const code = String(f.get("code") ?? "");

    const next: Errors = {};
    if (!name) next.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (!message) next.message = "Please add a short message.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0]!;
      (
        e.currentTarget.elements.namedItem(first) as HTMLElement | null
      )?.focus();
      return;
    }

    const body = [
      message,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${code} ${phone}` : "",
    ]
      .filter((l, i, a) => l !== "" || a[i - 1] !== "")
      .join("\n");
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(
      `Project enquiry from ${name}`,
    )}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

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

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Contact form"
      className="flex flex-col gap-9"
    >
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] opacity-0"
      />

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">
          <label htmlFor={`${id}-name`}>Your Name</label>
        </Label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          placeholder="Your Name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${id}-name-err` : undefined}
          className={field}
        />
        {err("name")}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">
          <label htmlFor={`${id}-email`}>Your Email</label>
        </Label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="Your Email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${id}-email-err` : undefined}
          className={field}
        />
        {err("email")}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">
          <label htmlFor={`${id}-phone`}>Your Phone</label>
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
            placeholder="Your Phone"
            className={field}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-white/70">
          <label htmlFor={`${id}-message`}>Message</label>
        </Label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Message"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${id}-message-err` : undefined}
          className={cn(field, "resize-none")}
        />
        {err("message")}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <Button type="submit" variant="signal">
            Submit Request
          </Button>
        </div>
        <p
          aria-live="polite"
          className="max-w-[46ch] text-[0.875rem] text-white/70"
        >
          {opened ? (
            <>
              Your email app should now open with the message ready to send. If
              it did not, write to{" "}
              <a
                href={`mailto:${to}`}
                className="font-semibold text-white underline underline-offset-[5px]"
              >
                {to}
              </a>
              .
            </>
          ) : (
            <>
              Submit opens your email app with this message ready to send to{" "}
              {to}.
            </>
          )}
        </p>
      </div>
    </form>
  );
}
