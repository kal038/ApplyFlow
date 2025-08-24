import { Request, Response } from "express";
import {
  getJobsByUserId as getJobsByUserIdDynamo,
  getJobById as getJobByJobIdDynamo,
  createJob as createJobDynamo,
  updateJob as updateJobDynamo,
  deleteJob as deleteJobDynamo,
} from "@/services/jobService";
import { generateJobId } from "@/utils/generateJobId";
import { AuthUser } from "@/types/index";
import { AppError } from "@/utils/AppError";
import { assertOwnership } from "@/utils/assertOwnership";
import {
  jobSchema,
  createJobSchema,
  updateJobSchema,
  jobResponseSchema,
  jobsResponseSchema,
} from "@/types/job";
import { ZodError } from "zod";

/*
Controller functions, deal with request and response objects
1. getAllJobs (get all jobs for a certain user)
2. getJobById (get a job by job_id)
3. createJob (create a new job, generate random job_id with helper)
4. updateJob (update a job with job_id, check on body)
5. deleteJob (delete a job with job_id)
*/

/**
 * Retrieves all jobs associated with an authenticated user.
 *
 * @param request - Express Request object containing authenticated user information
 * @param response - Express Response object to send back the jobs data
 * @throws {AppError} If retrieving jobs from DynamoDB fails
 * @returns Promise<void> - Returns void, sends JSON response with jobs data
 */
export const getAllJobs = async (
  request: Request,
  response: Response
): Promise<void> => {
  const authUser = request.user as AuthUser; //telling Ts that request.user is of type AuthUser
  //extract user_id from request confidently
  const { user_id } = authUser;
  try {
    const jobs = await getJobsByUserIdDynamo(user_id);
    const responseData = { jobs, count: Array.isArray(jobs) ? jobs.length : 0 };

    // Validate response shape
    const validated = jobsResponseSchema.parse(responseData);
    response.status(200).json(validated);
  } catch (error) {
    console.error("getAllJobs error:", error);
    throw new AppError("Error retrieving jobs", 500);
  }
};

/**
 * Create job with authenticated user information.
 *
 * @param request - Express Request object containing authenticated user information
 * @param response - Express Response object to send back the jobs data
 * @throws {AppError} If retrieving jobs from DynamoDB fails
 * @returns Promise<void> - Returns void, sends JSON response with new job data
 */
export const createJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    // Validate input
    const validatedInput = createJobSchema.parse(request.body);

    const authUser = request.user as AuthUser;
    const newJob = {
      job_id: generateJobId(),
      user_id: authUser.user_id,
      ...validatedInput,
  last_updated_at: Date.now(),
    };

    // Validate full job shape
    const validatedJob = jobSchema.parse(newJob);

    await createJobDynamo(validatedJob);

    const responseData = { job: validatedJob };
    const validatedResponse = jobResponseSchema.parse(responseData);
    response.status(201).json(validatedResponse);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        error: "Validation failed",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }
    console.error("createJob error:", error);
    throw new AppError("Error creating job", 500);
  }
};

/**
 * Delete job by job id, ensure ownership.
 */
export const deleteJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  const authUser = request.user as AuthUser;
  const userId = authUser.user_id;
  const { job_id } = request.params;

  try {
    const job = await getJobByJobIdDynamo(job_id);

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    assertOwnership(job, userId);

    await deleteJobDynamo(job_id);

    response.status(204).send();
  } catch (error) {
    console.error("deleteJob error:", error);
    throw new AppError("Error deleting job", 500);
  }
};

/**
 * Update job by job id, validate input and ownership, return updated job.
 */
export const updateJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  const authUser = request.user as AuthUser;
  const userId = authUser.user_id;
  const { job_id } = request.params;

  try {
    // Validate input (partial)
    const validatedFields = updateJobSchema.parse(request.body);

    if (Object.keys(validatedFields).length === 0) {
      response.status(400).json({ error: "No fields provided for update" });
      return;
    }

    const job = await getJobByJobIdDynamo(job_id);

    if (!job) {
      throw new AppError("Job not found", 404);
    }

    assertOwnership(job, userId);

    // Always bump last_updated_at when updating any field
    const updatedJob = await updateJobDynamo(job_id, {
      ...validatedFields,
      last_updated_at: Date.now(),
    });

    // Dynamo update result should have Attributes with the updated item
    const attrs = updatedJob?.Attributes;
    if (!attrs) {
      throw new AppError("Failed to update job", 500);
    }

    // Validate attributes against job schema
    const validatedJob = jobSchema.parse(attrs);

    const responseData = { job: validatedJob };
    const validatedResponse = jobResponseSchema.parse(responseData);
    response.status(200).json(validatedResponse);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).json({
        error: "Validation failed",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }
    console.error("updateJob error:", error);
    throw new AppError("Error updating job", 500);
  }
};
