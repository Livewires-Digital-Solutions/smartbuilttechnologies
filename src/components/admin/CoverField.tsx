"use client";

import { useRef, useState } from "react";
import { btn, inputCls } from "./styles";
import { uploadImage } from "./MarkdownEditor";

/**
 * The cover picture: upload (or remove) one, see it, and say what it shows. The picture's
 * address travels in a hidden field, so the form saves it with everything else.
 */
export function CoverField({
  defaultCover = "",
  defaultAlt = "",
  error,
  altError,
}: {
  defaultCover?: string;
  defaultAlt?: string;
  error?: string;
  altError?: string;
}) {
  const [cover, setCover] = useState(defaultCover);
  const [note, setNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setNote("Uploading…");
    const res = await uploadImage(f);
    if ("error" in res) setNote(res.error);
    else {
      setCover(res.url);
      setNote("");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-overline font-medium text-slate-700 uppercase">
        Cover picture (optional)
      </span>
      <input type="hidden" name="cover" value={cover} />
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex aspect-[4/3] w-48 items-center justify-center overflow-hidden border border-navy/15 bg-white text-center text-[0.8125rem] text-slate-500">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- an admin preview of a just-uploaded file
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="px-3">
              No picture. The site shows the brand panel instead.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`${btn} border border-navy/25 bg-white text-navy hover:border-navy`}
              onClick={() => fileRef.current?.click()}
            >
              {cover ? "Replace picture" : "Upload picture"}
            </button>
            {cover ? (
              <button
                type="button"
                className={`${btn} border border-navy/25 text-navy hover:border-orange hover:text-orange`}
                onClick={() => setCover("")}
              >
                Remove
              </button>
            ) : null}
          </div>
          <p className="max-w-[40ch] text-[0.8125rem] text-slate-700">
            JPG, PNG or WebP, up to 8 MB. Large pictures are resized for you.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="sr-only"
            aria-label="Choose a cover picture"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
      </div>
      <p aria-live="polite" className="text-[0.875rem] text-orange">
        {note || error}
      </p>
      {cover ? (
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-overline font-medium text-slate-700 uppercase">
            What the picture shows
          </span>
          <input
            name="coverAlt"
            defaultValue={defaultAlt}
            maxLength={200}
            className={inputCls}
            placeholder="For people who cannot see it, and for search"
          />
          {altError ? (
            <span role="alert" className="text-[0.875rem] text-orange">
              {altError}
            </span>
          ) : null}
        </label>
      ) : (
        <input type="hidden" name="coverAlt" value="" />
      )}
    </div>
  );
}
