import { create } from "zustand";
import type { Job } from "../types";

interface JobStore {
  jobs: Job[];
  loading: boolean;
  fetchJobs: () => Promise<void>;
  addJob: (job: Omit<Job, "job_id">) => Promise<void>;
  editJob: (
    job_id: string,
    updatedFields: Partial<Omit<Job, "job_id">>
  ) => Promise<void>;
  deleteJob: (job_id: string) => Promise<void>;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  loading: false,

  fetchJobs: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/v1/jobs", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data: Job[] = await res.json();
      set({ jobs: data });
    } catch (err) {
      console.error("Fetch jobs error:", err);
    } finally {
      set({ loading: false });
    }
  },

  addJob: async (job) => {
    try {
      const res = await fetch("/api/v1/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error("Failed to add job");
      const created: Job = await res.json();
      set((state) => ({
        jobs: [...state.jobs, created],
      }));
    } catch (err) {
      console.error("Add job error:", err);
    }
  },

  editJob: async (job_id, updatedFields) => {
    try {
      const res = await fetch(`/api/v1/jobs/${job_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error("Failed to edit job");
      const updated: Job = await res.json();
      set((state) => ({
        jobs: state.jobs.map((job) => (job.job_id === job_id ? updated : job)),
      }));
    } catch (err) {
      console.error("Edit job error:", err);
    }
  },

  deleteJob: async (job_id) => {
    try {
      const res = await fetch(`/api/v1/jobs/${job_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete job");
      set((state) => ({
        jobs: state.jobs.filter((job) => job.job_id !== job_id),
      }));
    } catch (err) {
      console.error("Delete job error:", err);
    }
  },
}));
