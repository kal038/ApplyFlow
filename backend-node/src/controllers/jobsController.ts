import { Request, Response } from "express";
import {
  getJobsByUserId as getJobsByUserIdDynamo,
  getJobById as getJobByJobIdDynamo,
  createJob as createJobDynamo,
  updateJob as updateJobDynamo,
  deleteJob as deleteJobDynamo,
} from "@/services/dynamo";
import { LineJob } from "@/types/index";
import { generateJobId } from "@/utils/generateJobId";
import { AuthUser } from "../types/index";
import { AppError } from "@/utils/AppError";
import { assertOwnership } from "@/utils/assertOwnership";
import { get } from "http";

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
    response.status(200).json(jobs);
  } catch (error) {
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
  const authUser = request.user as AuthUser; //telling Ts that request.user is of type AuthUser
  //extract user_id from request confidently
  const { user_id } = authUser;
  //extract job data from request body
  const jobData = request.body;
  //create new job object
  const job_id = generateJobId();
  const newJob: LineJob = {
    job_id: job_id,
    user_id: user_id,
    company: jobData.company,
    title: jobData.title,
    status: jobData.status,
    applied_date: jobData,
    notes: jobData.notes,
  };
  //call createJob function from dynamo service with async/await
  try {
    await createJobDynamo(newJob);
    response.status(201).json(newJob);
  } catch (error) {
    throw new AppError("Error creating job", 500);
  }
};

/**
 * Delete job by job id, have to confirm job exists and is owned by user
 *
 * @param request - Express Request object containing authenticated user information
 * @param response - Express Response object to send back the jobs data
 * @throws {AppError} If retrieving jobs from DynamoDB fails
 * @returns Promise<void> - Returns void, sends JSON response with new job data
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

    await deleteJobDynamo(job_id); // delete from db

    response.status(204).send();
  } catch (error) {
    throw new AppError("Error deleting job", 500);
  }
};

export const updateJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  const authUser = request.user as AuthUser;
  const userId = authUser.user_id;
  const { job_id } = request.params;
  const updatedFields: Partial<LineJob> = request.body;

  try {
    const job = await getJobByJobIdDynamo(job_id);

    if (!job) {
      throw new AppError("Job not found", 404); // we expect this may happen in our app
    }

    assertOwnership(job, userId);

    const updatedJob = await updateJobDynamo(job_id, updatedFields);

    response.status(200).json({ job: updatedJob.Attributes });
  } catch (error) {
    throw new AppError("Error updating job", 500);
  }
};
