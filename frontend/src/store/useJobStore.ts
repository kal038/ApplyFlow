import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Job } from "@/types";
import { apiFetch } from "@/utils/fetchHelper";

interface JobStore {
  jobs: Job[];
  loading: boolean;
  fetchJobs: () => Promise<void>;
  addJob: (job: Omit<Job, "job_id">) => Promise<void>;
  deleteJob: (job_id: string) => Promise<void>;
  updateJob: (job_id: string, updatedFields: Partial<Job>) => Promise<void>;
}

export const useJobStore = create<JobStore>()(
  devtools(
    (set) => ({
      jobs: [],
      loading: false,

      fetchJobs: async () => {
        set({ loading: true }, false, "setLoading");
        try {
          const response = await apiFetch("/api/v1/jobs");

          if (!response.ok) {
            throw new Error("Failed to fetch jobs");
          }

          const data = await response.json();
          // The backend returns jobs directly, not in a jobs property
          set({ jobs: Array.isArray(data) ? data : [] }, false, "fetchJobs");
        } catch (error) {
          console.error("Error fetching jobs:", error);
          set({ jobs: [] }, false, "fetchJobsError");
          throw error;
        } finally {
          set({ loading: false }, false, "clearLoading");
        }
      },

      addJob: async (job) => {
        // Create a temporary job with a temporary ID
        const tempJob: Job = {
          ...job,
          job_id: `temp-${Date.now()}`,
        };

        // Optimistically update UI immediately
        set(
          (state) => ({
            jobs: [...state.jobs, tempJob],
          }),
          false,
          "addJobOptimistic"
        );

        // Fire and forget - send to server in background
        try {
          await apiFetch("/api/v1/jobs", {
            method: "POST",
            body: JSON.stringify(job),
          });

          // We're not replacing the temp job in the UI -
          // it will be replaced next time fetchJobs() is called
        } catch (error) {
          console.error("Error adding job:", error);
          set(
            (state) => ({
              jobs: state.jobs.filter((job) => job.job_id !== tempJob.job_id)
            }),
            false,
            "removeFailedTempJob"
          );
        }
      },

      deleteJob: async (job_id) => {
        // Optimistically remove the job from UI
        set(
          (state) => ({
            jobs: state.jobs.filter((job) => job.job_id !== job_id),
          }),
          false,
          "deleteJobOptimistic"
        );

        // Fire and forget
        try {
          await apiFetch(`/api/v1/jobs/${job_id}`, {
            method: "DELETE",
          });
        } catch (error) {
          console.error("Error deleting job:", error);
          // Job remains removed from UI even if delete fails
        }
      },

      updateJob: async (job_id, updatedFields) => {
        // Optimistically update the job in UI
        set(
          (state) => ({
            jobs: state.jobs.map((job) =>
              job.job_id === job_id ? { ...job, ...updatedFields } : job
            ),
          }),
          false,
          "updateJobOptimistic"
        );

        // Send update to API
        try {
          await apiFetch(`/api/v1/jobs/${job_id}`, {
            method: "PUT",
            body: JSON.stringify(updatedFields),
            credentials: "include",
          });

          // We're not updating the state again since we've already done the optimistic update
        } catch (error) {
          console.error("Error updating job:", error);
          //TLDR: revert job display if app comes back with error
        }
      },
    }),
    { name: "JobStore" }
  )
);
