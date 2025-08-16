import { Request, Response } from "express";
import { z } from "zod";
import {
  getJobsByUserId as getJobsByUserIdDynamo,
  getJobById as getJobByJobIdDynamo,
  createJob as createJobDynamo,
  updateJob as updateJobDynamo,
  deleteJob as deleteJobDynamo,
} from "@/services/jobService";
import { LineJob } from "@/types/index";
import { generateJobId } from "@/utils/generateJobId";
import { AuthUser } from "@/types/index";
import { AppError } from "@/utils/AppError";
import { assertOwnership } from "@/utils/assertOwnership";

// Zod schemas for validation
const createJobSchema = z.object({
  company: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name too long"),
  title: z
    .string()
    .min(1, "Job title is required")
    .max(100, "Job title too long"),
  status: z.enum(
    ["applied", "interviewing", "offer", "rejected", "withdrawn"],
    {
      errorMap: () => ({ message: "Invalid status value" }),
    }
  ),
  applied_date: z.string().datetime("Invalid date format"),
  notes: z.string().max(1000, "Notes too long").optional().default(""),
});

const updateJobSchema = z
  .object({
    company: z.string().min(1).max(100).optional(),
    title: z.string().min(1).max(100).optional(),
    status: z
      .enum(["applied", "interviewing", "offer", "rejected", "withdrawn"])
      .optional(),
    applied_date: z.string().datetime().optional(),
    notes: z.string().max(1000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

const jobParamsSchema = z.object({
  job_id: z.string().min(1, "Job ID is required"),
});

/**
 * Retrieves all jobs associated with an authenticated user.
 */
export const getAllJobs = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const authUser = request.user as AuthUser;
    const { user_id } = authUser;

    const jobs = await getJobsByUserIdDynamo(user_id);
    response.status(200).json({ jobs, count: jobs.length });
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    throw new AppError("Error retrieving jobs", 500);
  }
};

/**
 * Create job with authenticated user information and validated data.
 */
export const createJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = createJobSchema.parse(request.body);

    const authUser = request.user as AuthUser;
    const { user_id } = authUser;

    const job_id = generateJobId();
    const newJob: LineJob = {
      job_id,
      user_id,
      ...validatedData,
    };

    await createJobDynamo(newJob);
    response.status(201).json({ job: newJob });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      response.status(400).json({
        error: "Validation failed",
        details: errorMessages,
      });
      return;
    }

    console.error("Error in createJob:", error);
    throw new AppError("Error creating job", 500);
  }
};

/**
 * Delete job by job id, with validation and ownership checks.
 */
export const deleteJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    // Validate params
    const { job_id } = jobParamsSchema.parse(request.params);

    const authUser = request.user as AuthUser;
    const userId = authUser.user_id;

    const job = await getJobByJobIdDynamo(job_id);

    if (!job) {
      response.status(404).json({ error: "Job not found" });
      return;
    }

    assertOwnership(job, userId);
    await deleteJobDynamo(job_id);

    response.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({
        error: "Invalid job ID format",
      });
      return;
    }

    // Handle known AppErrors (like ownership issues)
    if (error instanceof AppError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error("Error in deleteJob:", error);
    throw new AppError("Error deleting job", 500);
  }
};

/**
 * Update job with validated data and ownership checks.
 */
export const updateJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    // Validate params and body
    const { job_id } = jobParamsSchema.parse(request.params);
    const validatedFields = updateJobSchema.parse(request.body);

    const authUser = request.user as AuthUser;
    const userId = authUser.user_id;

    const job = await getJobByJobIdDynamo(job_id);

    if (!job) {
      response.status(404).json({ error: "Job not found" });
      return;
    }

    assertOwnership(job, userId);

    const updatedJob = await updateJobDynamo(job_id, validatedFields);

    response.status(200).json({ job: updatedJob.Attributes });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      response.status(400).json({
        error: "Validation failed",
        details: errorMessages,
      });
      return;
    }

    // Handle known AppErrors (like ownership issues)
    if (error instanceof AppError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error("Error in updateJob:", error);
    throw new AppError("Error updating job", 500);
  }
};
