import { useJobStore } from "../store/useJobStore";
import { JobTable } from "../components/JobTable";

import type { Job } from "../types";

export function DashboardPage() {
  const { deleteJob } = useJobStore();

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
    <div className="p-4">
      <JobTable onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
