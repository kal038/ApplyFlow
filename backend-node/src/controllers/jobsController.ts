import { Request, Response } from "express";
import {
  getJobById as getJobByIdDynamo,
  createJob as createJobDynamo,
  updateJob as updateJobDynamo,
  deleteJob as deleteJobDynamo,
} from "../services/dynamo";
import { LineJob } from "../types/index";

/*
Controller functions, deal with request and response objects
1. getAllJobs
2. getJobById
3. createJob
4. updateJob
5. deleteJob
*/
export const getAllJobs = (request: Request, response: Response): void => {
  //access mock DB or array in memory
  //return jobs as JSON
  // Implementation needed - this appears to be using an undefined variable 'jobs'
  response.status(501).json({ message: "Not implemented" });
};

export const getJobById = async (
  request: Request,
  response: Response
): Promise<void> => {
  // extract job_id from the request, stuff into const job_id
  const { job_id } = request.params;
  //look up
  //find job in dynamo
  try {
    const job = await getJobByIdDynamo(job_id);
    //if found, return job as JSON
    if (job) {
      response.json(job);
    } else {
      //if not found, return 404
      response.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error getting job:", error);
    response.status(500).json({ message: "Error retrieving job" });
  }
};

export const createJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  //extract job data from request body
  const job = request.body;
  //generate unique job_id
  const job_id = `job-${Math.floor(Math.random() * 1000)}`;
  //create new job object
  const newJob: LineJob = {
    job_id,
    user_id: job.user_id,
    company: job.company,
    title: job.title,
    status: job.status,
    applied_date: job.applied_date,
    notes: job.notes,
  };
  //call createJob function from dynamo service with async/await
  try {
    await createJobDynamo(newJob);
    response.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    response.status(500).json({ message: "Error creating job" });
  }
};

export const deleteJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  //extract job_id from request params
  const { job_id } = request.params;
  //call deleteJob function from dynamo service
  try {
    const data = await deleteJobDynamo(job_id);
    //if successful, return 204 No Content
    if (data.Attributes) {
      console.error("Job deleted successfully:", data.Attributes);
    } else {
      console.error("Job not found");
      response.status(404).json({ message: "Job not found" });
      return;
    }
    //return 204 No Content
    response.status(204).send();
  } catch (error) {
    console.error("Unexpected Error deleting job:", error);
    // Handle other errors
    response.status(500).json({ message: "Unexpected Error deleting job" });
  }
};

export const updateJob = async (
  request: Request,
  response: Response
): Promise<void> => {
  //extract job_id from request params
  const { job_id } = request.params;
  //extract job data from request body
  const updated_job = request.body;
  if (!updated_job || Object.keys(updated_job).length === 0) {
    response.status(400).json({ message: "Invalid job data" });
    return;
  }
  // send job_id and updated_job to dynamo service
  try {
    const data = await updateJobDynamo(job_id, updated_job);
    //if successful, return 200 OK with updated job
    if (data.Attributes) {
      response.status(200).json(data.Attributes);
    } else {
      response.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error updating job:", error);
    if (
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      response.status(404).json({ message: "Job not found" });
      return;
    }
    response.status(500).json({ message: "Error updating job" });
  }
};
