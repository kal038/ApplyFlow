import {
  getJobById as getJobByIdDynamo,
  getAllJobsUser as getAllJobsUserDynamo,
  createJob as createJobDynamo,
  updateJob as updateJobDynamo,
  deleteJob as deleteJobDynamo,
} from "../services/dynamo.js";
// const jobs = [
//   {
//     job_id: "job-001",
//     user_id: "user-123",
//     company: "Tesla",
//     title: "Backend Engineer",
//     status: "Interview",
//     applied_date: "2025-04-01",
//     notes: "Recruiter screen done",
//   },
//   {
//     job_id: "job-002",
//     user_id: "user-123",
//     company: "Stripe",
//     title: "Software Engineer",
//     status: "Applied",
//     applied_date: "2025-04-10",
//     notes: "Waiting for response",
//   },
//   {
//     job_id: "job-003",
//     user_id: "user-456",
//     company: "Meta",
//     title: "Infrastructure Engineer",
//     status: "Offer",
//     applied_date: "2025-03-28",
//     notes: "Offer received, deciding soon",
//   },
// ];
/*
Controller functions, deal with request and response objects
1. getAllJobs
2. getJobById
3. createJob
4. updateJob
5. deleteJob
*/
export const getAllJobs = (request, response) => {
  //access mock DB or array in memory
  //return jobs as JSON
  response.json(jobs);
};

export const getJobById = async (request, response) => {
  // extract job_id from the request, stuff into const job_id
  const { job_id } = request.params;
  //look up
  //find job in dynamo
  const job = await getJobByIdDynamo(job_id);
  //if found, return job as JSON
  if (job) {
    response.json(job);
  } else {
    //if not found, return 404
    response.status(404).json({ message: "Job not found" });
  }
};

export const createJob = async (request, response) => {
  //extract job data from request body
  const job = request.body;
  //generate unique job_id
  const job_id = `job-${Math.floor(Math.random() * 1000)}`;
  //create new job object
  const newJob = {
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
    return response.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    return response.status(500).json({ message: "Error creating job" });
  }
};

export const deleteJob = async (request, response) => {
  //extract job_id from request params
  const { job_id } = request.params;
  //call deleteJob function from dynamo service
  try {
    const data = await deleteJobDynamo(job_id);
    //if successful, return 204 No Content
    if (data.Attributes) {
      console.log("Job deleted successfully:", data.Attributes);
    } else {
      console.log("Job not found");
      return response.status(404).json({ message: "Job not found" });
    }
    //return 204 No Contentß
    response.status(204).send();
  } catch (error) {
    console.error("Unexpected Error deleting job:", error);
    // Handle other errors
    response.status(500).json({ message: "Unexpected Error deleting job" });
  }
};

export const updateJob = async (request, response) => {
  //extract job_id from request params
  const { job_id } = request.params;
  //extract job data from request body
  const updated_job = request.body;
  if (!updated_job || Object.keys(updated_job).length === 0) {
    return response.status(400).json({ message: "Invalid job data" });
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
    if (error.name === "ConditionalCheckFailedException") {
      return response.status(404).json({ message: "Job not found" });
    }
    response.status(500).json({ message: "Error updating job" });
  }
};
