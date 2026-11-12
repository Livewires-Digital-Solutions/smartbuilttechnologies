import { getCvFile } from "@/lib/applications";
import { hasSession } from "@/lib/auth";
import { attachmentHeader, readCv } from "@/lib/uploads";

/** Sends one applicant's CV to a signed-in admin. CV files are never reachable any other way. */
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await hasSession()))
    return new Response("Not signed in", { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1)
    return new Response("Not found", { status: 404 });
  const cv = await getCvFile(id);
  if (!cv) return new Response("Not found", { status: 404 });
  let body: Buffer;
  try {
    body = await readCv(cv.path);
  } catch {
    return new Response("The CV file is missing from the server.", {
      status: 404,
    });
  }
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": cv.mime,
      "Content-Disposition": attachmentHeader(cv.name),
      "Content-Length": String(body.length),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
