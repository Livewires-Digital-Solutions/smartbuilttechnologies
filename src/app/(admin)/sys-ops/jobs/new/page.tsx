import { JobForm } from "@/components/admin/JobForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewJobPage() {
  await requireAdmin();
  return (
    <div className="flex max-w-[900px] flex-col gap-6">
      <div>
        <p className="font-mono text-overline font-medium text-slate-700 uppercase">
          Jobs
        </p>
        <h1 className="text-[2rem] leading-tight font-medium tracking-[-0.04em]">
          Post a job
        </h1>
      </div>
      <JobForm />
    </div>
  );
}
