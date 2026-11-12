import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * CV storage on the server's disk (UPLOAD_DIR, outside public/, so files are only
 * reachable through the signed-in admin download route). A file is accepted only if
 * its extension, its declared type and its first bytes all say PDF, DOC or DOCX, and
 * it is within the size limit.
 */

export const MAX_CV_BYTES = 5 * 1024 * 1024;

const KINDS: Record<string, { mime: string; magic: number[] }> = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  doc: { mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE2
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    magic: [0x50, 0x4b, 0x03, 0x04], // zip
  },
};

export function uploadDir() {
  return path.resolve(process.env.UPLOAD_DIR || "./storage/cv");
}

export class UploadError extends Error {}

/** Checks the file and returns its kind, or throws an UploadError with a message fit to show. */
export async function validateCv(
  file: File,
): Promise<{ ext: string; mime: string; bytes: Buffer }> {
  if (file.size === 0) throw new UploadError("The file is empty.");
  if (file.size > MAX_CV_BYTES)
    throw new UploadError("The file is larger than 5 MB.");
  const ext = path.extname(file.name).slice(1).toLowerCase();
  const kind = KINDS[ext];
  if (!kind) throw new UploadError("Please upload a PDF, DOC or DOCX file.");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!kind.magic.every((b, i) => bytes[i] === b)) {
    throw new UploadError(
      "That file does not look like a real " + ext.toUpperCase() + " document.",
    );
  }
  return { ext, mime: kind.mime, bytes };
}

export async function saveCv(file: File) {
  const { ext, mime, bytes } = await validateCv(file);
  const dir = uploadDir();
  await mkdir(/*turbopackIgnore: true*/ dir, { recursive: true });
  const stored = `${randomUUID()}.${ext}`;
  await writeFile(/*turbopackIgnore: true*/ path.join(dir, stored), bytes, { flag: "wx", mode: 0o640 });
  return { path: stored, mime, size: bytes.length, name: cleanName(file.name) };
}

/** The file's name with anything that could cause trouble in a header or on disk removed. */
export function cleanName(name: string) {
  const base = path
    .basename(name)
    .replace(/[^\w.\- ()]+/g, "_")
    .trim();
  return (base || "cv").slice(0, 200);
}

/** Resolves a stored name inside the upload folder, refusing anything that escapes it. */
function inside(stored: string) {
  const dir = uploadDir();
  const full = path.resolve(dir, stored);
  if (path.dirname(full) !== dir) throw new Error("Invalid CV path");
  return full;
}

export async function readCv(stored: string) {
  return readFile(/*turbopackIgnore: true*/ inside(stored));
}

export async function removeCv(stored: string) {
  try {
    await unlink(/*turbopackIgnore: true*/ inside(stored));
  } catch {
    // already gone
  }
}
