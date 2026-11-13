"use client";

import { useRef, useState } from "react";
import { Markdown } from "@/components/ui/Markdown";
import { cn } from "@/lib/cn";
import { btn } from "./styles";

/** Uploads one picture to the media library and returns its web address. */
export async function uploadImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  const body = new FormData();
  body.set("file", file);
  try {
    const res = await fetch("/sys-ops/media", { method: "POST", body });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      url?: string;
      error?: string;
    };
    if (res.ok && data.ok && data.url) return { url: data.url };
    return { error: data.error ?? "The upload failed." };
  } catch {
    return { error: "We could not reach the server. Check your connection." };
  }
}

const tool =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-button)] border border-navy/25 bg-white px-2.5 text-[0.8125rem] font-semibold text-navy hover:border-navy focus-visible:border-navy";

/**
 * A Markdown editor: a toolbar for the common marks, the text, a live preview that uses
 * the same renderer as the public site, and picture upload that puts the picture where
 * the cursor is. Below the large breakpoint the preview is a tab, above it sits beside
 * the text.
 */
export function MarkdownEditor({
  name,
  defaultValue = "",
  error,
  rows = 20,
}: {
  name: string;
  defaultValue?: string;
  error?: string;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [note, setNote] = useState("");

  const edit = (
    fn: (
      before: string,
      selected: string,
      after: string,
    ) => { text: string; select: [number, number] },
  ) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const out = fn(text.slice(0, a), text.slice(a, b), text.slice(b));
    setText(out.text);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(out.select[0], out.select[1]);
    });
  };
  const wrap = (mark: string, placeholder: string) =>
    edit((before, sel, after) => {
      const inner = sel || placeholder;
      return {
        text: `${before}${mark}${inner}${mark}${after}`,
        select: [
          before.length + mark.length,
          before.length + mark.length + inner.length,
        ],
      };
    });
  /** Puts `prefix` at the start of the current line(s). */
  const line = (prefix: string, placeholder: string) =>
    edit((before, sel, after) => {
      const start = before.lastIndexOf("\n") + 1;
      const head = before.slice(0, start);
      const lead = before.slice(start);
      const inner = sel || placeholder;
      const body = inner
        .split("\n")
        .map((l) => `${prefix}${l}`)
        .join("\n");
      return {
        text: `${head}${lead}${body}${after}`.replace(/^/, ""),
        select: [
          head.length + lead.length + prefix.length,
          head.length + lead.length + body.length,
        ],
      };
    });
  const link = () =>
    edit((before, sel, after) => {
      const label = sel || "link text";
      const url = "https://";
      const t = `${before}[${label}](${url})${after}`;
      const s = before.length + label.length + 3;
      return { text: t, select: [s, s + url.length] };
    });
  const insertImage = (url: string, alt: string) =>
    edit((before, _sel, after) => {
      const md = `![${alt}](${url})`;
      const lead =
        before && !before.endsWith("\n\n")
          ? before.endsWith("\n")
            ? "\n"
            : "\n\n"
          : "";
      const trail = after.startsWith("\n\n")
        ? ""
        : after.startsWith("\n")
          ? "\n"
          : "\n\n";
      const t = `${before}${lead}${md}${trail}${after}`;
      const pos = before.length + lead.length + md.length;
      return { text: t, select: [pos, pos] };
    });

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setNote("Uploading…");
    const res = await uploadImage(f);
    if ("error" in res) setNote(res.error);
    else {
      insertImage(
        res.url,
        f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      );
      setNote(
        "Picture added. Edit the words in the square brackets to set its caption.",
      );
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-wrap items-center gap-2"
        role="toolbar"
        aria-label="Formatting"
      >
        <button
          type="button"
          className={tool}
          onClick={() => line("## ", "Heading")}
        >
          H2
        </button>
        <button
          type="button"
          className={tool}
          onClick={() => line("### ", "Subheading")}
        >
          H3
        </button>
        <button
          type="button"
          className={cn(tool, "font-bold")}
          aria-label="Bold"
          onClick={() => wrap("**", "bold text")}
        >
          B
        </button>
        <button
          type="button"
          className={cn(tool, "italic")}
          aria-label="Italic"
          onClick={() => wrap("*", "italic text")}
        >
          I
        </button>
        <button type="button" className={tool} onClick={link}>
          Link
        </button>
        <button
          type="button"
          className={tool}
          onClick={() => line("- ", "List item")}
        >
          • List
        </button>
        <button
          type="button"
          className={tool}
          onClick={() => line("1. ", "List item")}
        >
          1. List
        </button>
        <button
          type="button"
          className={tool}
          onClick={() => line("> ", "Quote")}
        >
          Quote
        </button>
        <button
          type="button"
          className={cn(
            btn,
            "h-9 border border-navy/25 bg-white px-3 text-navy hover:border-navy",
          )}
          onClick={() => fileRef.current?.click()}
        >
          Add picture
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="sr-only"
          aria-label="Choose a picture to add to the text"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <div
          className="ml-auto flex gap-1 lg:hidden"
          role="tablist"
          aria-label="Editor view"
        >
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                tool,
                "capitalize",
                tab === t && "border-navy bg-navy text-white",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="min-h-5 text-[0.8125rem] text-slate-700">
        {note}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          ref={ref}
          name={name}
          rows={rows}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck
          aria-label="Text, written in Markdown"
          aria-invalid={!!error}
          className={cn(
            "min-h-[28rem] w-full resize-y rounded-[var(--radius-button)] border border-navy/25 bg-white px-4 py-3 font-mono text-[0.875rem] leading-relaxed text-navy placeholder:text-slate-500 hover:border-navy/50 focus:border-navy focus:outline-none aria-[invalid=true]:border-orange",
            tab === "preview" && "max-lg:hidden",
          )}
          placeholder={
            "Write here. Use ## for a heading, **bold**, - for a list.\nLeave a blank line between paragraphs."
          }
        />
        <div
          aria-label="Preview"
          className={cn(
            "max-h-[40rem] min-h-[28rem] overflow-auto rounded-[var(--radius-button)] border border-navy/15 bg-white px-6 py-5",
            tab === "write" && "max-lg:hidden",
          )}
        >
          {text.trim() ? (
            <Markdown>{text}</Markdown>
          ) : (
            <p className="text-slate-500">
              The preview appears here as you write.
            </p>
          )}
        </div>
      </div>
      {error ? (
        <span role="alert" className="text-[0.875rem] text-orange">
          {error}
        </span>
      ) : null}
    </div>
  );
}
