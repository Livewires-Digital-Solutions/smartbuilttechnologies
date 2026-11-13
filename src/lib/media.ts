import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Images uploaded in the admin area (blog and event covers, pictures inside articles).
 * They are stored in MEDIA_DIR, outside public/, and served by the /media route.
 *
 * An upload is accepted only if its extension, its first bytes AND a real decode agree
 * that it is a JPEG, PNG or WebP picture. It is then re-encoded: that removes metadata
 * (camera, GPS location), straightens phone photos, caps the size on screen and defuses
 * files that are an image and something else at once. SVG is refused on purpose, since it
 * can carry script.
 */

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_EDGE = 2400;

const KINDS: Record<string, { mime: string; magic: (b: Buffer) => boolean }> = {
  jpg: {
    mime: "image/jpeg",
    magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  jpeg: {
    mime: "image/jpeg",
    magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  png: {
    mime: "image/png",
    magic: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  webp: {
    mime: "image/webp",
    magic: (b) =>
      b.toString("latin1", 0, 4) === "RIFF" &&
      b.toString("latin1", 8, 12) === "WEBP",
  },
};

export const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export class MediaError extends Error {}

export function mediaDir() {
  return path.resolve(process.env.MEDIA_DIR || "./storage/media");
}

/** The only file names the /media route will look up: a UUID and a known extension. */
export const MEDIA_NAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export async function saveImage(
  file: File,
): Promise<{ name: string; url: string; width: number; height: number }> {
  if (file.size === 0) throw new MediaError("The file is empty.");
  if (file.size > MAX_IMAGE_BYTES)
    throw new MediaError("The image is larger than 8 MB.");
  const ext = path.extname(file.name).slice(1).toLowerCase();
  const kind = KINDS[ext];
  if (!kind) throw new MediaError("Please upload a JPG, PNG or WebP image.");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!kind.magic(bytes))
    throw new MediaError(
      `That file does not look like a real ${ext.toUpperCase()} image.`,
    );

  let out: Buffer;
  let info: { width: number; height: number };
  const outExt = ext === "jpeg" ? "jpg" : ext;
  try {
    let img = sharp(bytes, { failOn: "error", limitInputPixels: 80_000_000 })
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      });
    if (outExt === "jpg") img = img.jpeg({ quality: 84, mozjpeg: true });
    else if (outExt === "png") img = img.png({ compressionLevel: 9 });
    else img = img.webp({ quality: 84 });
    ({ data: out, info } = await img.toBuffer({ resolveWithObject: true }));
  } catch {
    throw new MediaError("That image could not be read. It may be damaged.");
  }

  const dir = mediaDir();
  await mkdir(/*turbopackIgnore: true*/ dir, { recursive: true });
  const name = `${randomUUID()}.${outExt}`;
  await writeFile(/*turbopackIgnore: true*/ path.join(dir, name), out, {
    flag: "wx",
    mode: 0o644,
  });
  return {
    name,
    url: `/media/${name}`,
    width: info.width,
    height: info.height,
  };
}

export async function readMedia(name: string): Promise<Buffer | null> {
  if (!MEDIA_NAME.test(name)) return null;
  try {
    return await readFile(
      /*turbopackIgnore: true*/ path.join(mediaDir(), name),
    );
  } catch {
    return null;
  }
}
