import { MEDIA_NAME, MIME_BY_EXT, readMedia } from "@/lib/media";

/** Serves an uploaded image. File names are random UUIDs, so they can be cached for a year. */
export async function GET(
  _: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!MEDIA_NAME.test(name)) return new Response("Not found", { status: 404 });
  const body = await readMedia(name);
  if (!body) return new Response("Not found", { status: 404 });
  const ext = name.slice(name.lastIndexOf(".") + 1);
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
      "Content-Length": String(body.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}
