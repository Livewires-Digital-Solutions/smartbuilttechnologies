import Link from "next/link";
import { notFound } from "next/navigation";
import { JobForm } from "@/components/admin/JobForm";
import { JobStatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { adminGetJob, isOpenNow } from "@/lib/jobs";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const id = Number((await params).id);
  const job = Number.isInteger(id) && id > 0 ? await adminGetJob(id) : null;
  if (!job) notFound();

  return (
    <div className="flex max-w-[900px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-overline font-medium text-slate-700 uppercase">
            Jobs
          </p>
          <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
            Edit position
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <JobStatusBadge
            status={job.status}
            ended={job.status === "open" && !isOpenNow(job)}
          />
          <Link
            href={`/sys-ops/applications?job=${job.id}`}
            className="text-[0.9375rem] font-semibold underline underline-offset-[5px]"
          >
            {job.applicationCount ?? 0} application
            {job.applicationCount === 1 ? "" : "s"}
          </Link>
          {job.status !== "draft" ? (
            <Link
              href={`/careers/${job.slug}`}
              target="_blank"
              className="text-[0.9375rem] font-semibold underline underline-offset-[5px]"
            >
              View page
            </Link>
          ) : null}
        </div>
      </div>
      <JobForm job={job} />
    </div>
  );
}
