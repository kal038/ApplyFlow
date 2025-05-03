import { useJobStore } from "@/store/useJobStore";
import { JobTable } from "@/components/app/JobTable";
import type { Job } from "@/types";
import { useEffect } from "react";

export function DashboardPage() {
  const jobs = useJobStore((state) => state.jobs);
  const { deleteJob } = useJobStore();

  // Enable dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleEdit = (job: Job) => {
    alert(`Edit clicked for ${job.company}`);
    // later → open modal
  };

  const handleDelete = (job_id: string) => {
    if (confirm("Delete this job?")) {
      deleteJob(job_id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">ApplyFlow</h1>
        </div>
      </header>
      <main className="flex-1 h-full">
        <JobTable jobs={jobs} onEdit={handleEdit} onDelete={handleDelete} />
      </main>
    </div>
  );
}
