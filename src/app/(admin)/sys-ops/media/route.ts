import { NextResponse } from "next/server";
import { hasSession } from "@/lib/auth";
import { MediaError, saveImage } from "@/lib/media";
import { allow, clientIp } from "@/lib/rate-limit";

/**
 * Image upload for the editors (cover images and pictures inside articles). Signed-in
 * admins only. Returns the picture's web address, ready to use as a cover or to put in
 * Markdown.
 */
export async function POST(request: Request) {
  if (!(await hasSession())) {
    return NextResponse.json(
      { ok: false, error: "Please sign in again." },
      { status: 401 },
    );
  }
  if (!allow(`media:${await clientIp()}`, 60, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Too many uploads. Please wait a moment." },
      { status: 429 },
    );
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not read that upload." },
      { status: 400 },
    );
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Choose an image first." },
      { status: 422 },
    );
  }
  try {
    const img = await saveImage(file);
    return NextResponse.json({
      ok: true,
      url: img.url,
      width: img.width,
      height: img.height,
    });
  } catch (e) {
    if (e instanceof MediaError) {
      return NextResponse.json(
        { ok: false, error: e.message },
        { status: 422 },
      );
    }
    console.error("[media] upload failed:", e);
    return NextResponse.json(
      { ok: false, error: "The upload failed. Please try again." },
      { status: 500 },
    );
  }
}
