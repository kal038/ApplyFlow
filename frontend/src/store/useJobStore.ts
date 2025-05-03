import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Job } from "@/types";

interface JobStore {
  jobs: Job[];
  loading: boolean;
  fetchJobs: () => Promise<void>;
  addJob: (job: Omit<Job, "job_id">) => Promise<void>;
  deleteJob: (job_id: string) => Promise<void>;
}

export const useJobStore = create<JobStore>()(
  devtools(
    (set) => ({
      jobs: [],
      loading: false,

      fetchJobs: async () => {
        set({ loading: true }, false, "setLoading");
        try {
          const response = await fetch("/api/v1/jobs", {
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch jobs");
          }

          const data = await response.json();
          set({ jobs: data.jobs }, false, "fetchJobs");
        } catch (error) {
          console.error("Error fetching jobs:", error);
          throw error;
        } finally {
          set({ loading: false }, false, "clearLoading");
        }
      },

      addJob: async (job) => {
        try {
          const response = await fetch("/api/v1/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(job),
          });

          if (!response.ok) {
            throw new Error("Failed to add job");
          }

          const newJob = await response.json();
          set((state) => ({ jobs: [...state.jobs, newJob] }), false, "addJob");
        } catch (error) {
          console.error("Error adding job:", error);
          throw error;
        }
      },

      deleteJob: async (job_id) => {
        try {
          const response = await fetch(`/api/v1/jobs/${job_id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete job");
          }

          set(
            (state) => ({
              jobs: state.jobs.filter((job) => job.job_id !== job_id),
            }),
            false,
            "deleteJob"
          );
        } catch (error) {
          console.error("Error deleting job:", error);
          throw error;
        }
      },
    }),
    { name: "JobStore" }
  )
);
