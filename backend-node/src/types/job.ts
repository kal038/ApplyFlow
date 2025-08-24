import { z } from "zod";

// Base job schema
export const jobSchema = z.object({
  job_id: z.string().min(1),
  user_id: z.string().min(1),
  company: z.string().min(1).max(100).trim(),
  title: z.string().min(1).max(100).trim(),
  status: z.enum(["Applied", "Interviewing", "Offer", "Rejected", "Withdrawn"]),
  applied_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  notes: z.string().max(1000).optional().default(""),
  // Unix epoch milliseconds of last update; used for staleness calculations
  last_updated_at: z.number().int().nonnegative(),
});

// Input schemas for create/update
export const createJobSchema = jobSchema.omit({
  job_id: true,
  user_id: true,
});

export const updateJobSchema = createJobSchema.partial();

// Response schemas
export const jobResponseSchema = z.object({
  job: jobSchema,
});

export const jobsResponseSchema = z.object({
  jobs: z.array(jobSchema),
  count: z.number().int().nonnegative(),
});

// Infer types from schemas
export type Job = z.infer<typeof jobSchema>;
export type CreateJob = z.infer<typeof createJobSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
export type JobResponse = z.infer<typeof jobResponseSchema>;
export type JobsResponse = z.infer<typeof jobsResponseSchema>;
