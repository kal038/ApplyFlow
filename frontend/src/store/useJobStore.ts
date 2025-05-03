import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Job } from "@/types";

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

export const useJobStore = create<JobStore>()(
  devtools(
    (set) => ({
      jobs: [
        {
          job_id: "1",
          company: "Google",
          title: "Backend Engineer",
          status: "Applied",
          applied_date: "2025-05-01",
          notes: "Referred by Alice",
        },
        {
          job_id: "2",
          company: "Tesla",
          title: "Software Engineer",
          status: "Interview",
          applied_date: "2025-04-20",
          notes: "Technical interview scheduled",
        },
      ],
      loading: false,

      fetchJobs: async () => {
        console.log("fetchJobs called");
      },

      addJob: async (job) => {
        const newJob: Job = {
          ...job,
          job_id: crypto.randomUUID(),
        };
        set(
          (state) => ({
            jobs: [...state.jobs, newJob],
          }),
          false,
          "addJob"
        ); // name action for DevTools
      },

      editJob: async (job_id, updatedFields) => {
        set(
          (state) => ({
            jobs: state.jobs.map((job) =>
              job.job_id === job_id ? { ...job, ...updatedFields } : job
            ),
          }),
          false,
          "editJob"
        );
      },

      deleteJob: async (job_id) => {
        set(
          (state) => ({
            jobs: state.jobs.filter((job) => job.job_id !== job_id),
          }),
          false,
          "deleteJob"
        );
      },
    }),
    { name: "JobStore" }
  )
);
