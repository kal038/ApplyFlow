import { useJobStore } from "@/store/useJobStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { JobTable } from "@/components/app/JobTable";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types";
import { useEffect } from "react";

export function DashboardPage() {
  const jobs = useJobStore((state) => state.jobs);
  const { deleteJob } = useJobStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

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
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>
      <main className="flex-1 h-full">
        <JobTable jobs={jobs} onEdit={handleEdit} onDelete={handleDelete} />
      </main>
    </div>
  );
}
