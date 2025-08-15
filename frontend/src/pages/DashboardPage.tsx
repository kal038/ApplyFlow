import { useJobStore } from "@/store/useJobStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { JobTable } from "@/components/app/JobTable";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types";
import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";

// You'll need to create this modal component
import { JobFormModal } from "@/components/app/JobFormModal";

export function DashboardPage() {
  const jobs = useJobStore((state) => state.jobs);
  const { fetchJobs, addJob, deleteJob, updateJob } = useJobStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<Job> | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs().catch(console.error);
  }, [fetchJobs]);

  // Enable dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleSignOut = async () => {
    try {
      // Call backend to clear cookie
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      // Clear local auth state
      logout();
      // Redirect to landing page
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleAddJob = () => {
    // Don't set a job_id at all when creating a new job
    setCurrentJob({
      company: "",
      title: "",
      status: "Applied",
      applied_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (job: Job) => {
    setCurrentJob(job);
    setIsModalOpen(true);
  };

  const handleDelete = (job_id: string) => {
    setJobToDelete(job_id);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete);
      setJobToDelete(null);
    }
  };

  const cancelDelete = () => {
    setJobToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedJobIds.length === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    selectedJobIds.forEach((id) => deleteJob(id)); // optimistic per deleteJob
    setSelectedJobIds([]);
    setShowBulkDeleteConfirm(false);
  };

  const cancelBulkDelete = () => {
    setShowBulkDeleteConfirm(false);
  };

  const handleSaveJob = async (job: Partial<Job>) => {
    try {
      if (job.job_id) {
        // This is an existing job being edited
        await updateJob(job.job_id, {
          company: job.company,
          title: job.title,
          status: job.status,
          applied_date: job.applied_date,
          notes: job.notes,
        });
      } else {
        // This is a new job being created with optimistic update
        await addJob({
          company: job.company || "",
          title: job.title || "",
          status: job.status || "Applied",
          applied_date:
            job.applied_date || new Date().toISOString().split("T")[0],
          notes: job.notes || "",
        });
      }
      setIsModalOpen(false);

      // No need to fetchJobs() here since we're using optimistic updates
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">ApplyFlow</h1>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>
      <main className="flex-1 h-full">
        <div className="container py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Your Jobs</h2>
            <Button onClick={handleAddJob} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Job
            </Button>
          </div>

          <JobTable
            jobs={jobs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectionChange={setSelectedJobIds} // NEW
          />

          {selectedJobIds.length > 0 && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-card border rounded-full shadow-lg pl-4 pr-3 py-2">
              <span className="text-sm">{selectedJobIds.length} selected</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="h-8 gap-1"
              >
                <Trash className="h-4 w-4" />
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedJobIds([])}
                className="h-8"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && currentJob && (
        <JobFormModal
          job={currentJob}
          onSave={handleSaveJob}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {jobToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Job</h3>
            <p className="mb-6">Are you sure you want to delete this job?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Selected Jobs</h3>
            <p className="mb-6">
              Delete {selectedJobIds.length} selected job
              {selectedJobIds.length > 1 ? "s" : ""}? This cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelBulkDelete}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmBulkDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
