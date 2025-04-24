import { getJobById as getJobByIdDynamo } from "../services/dynamo.js";
const jobs = [
  {
    job_id: "job-001",
    user_id: "user-123",
    company: "Tesla",
    title: "Backend Engineer",
    status: "Interview",
    applied_date: "2025-04-01",
    notes: "Recruiter screen done",
  },
  {
    job_id: "job-002",
    user_id: "user-123",
    company: "Stripe",
    title: "Software Engineer",
    status: "Applied",
    applied_date: "2025-04-10",
    notes: "Waiting for response",
  },
  {
    job_id: "job-003",
    user_id: "user-456",
    company: "Meta",
    title: "Infrastructure Engineer",
    status: "Offer",
    applied_date: "2025-03-28",
    notes: "Offer received, deciding soon",
  },
];

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

export const createJob = (request, response) => {
  //get info from request body
  const { user_id, company, title, status, applied_date, notes } = request.body;
  //create new job object with job_id
  const job_id = "123"; // generate unique job_id
  const newJob = {
    job_id,
    user_id,
    company,
    title,
    status,
    applied_date,
    notes,
  };
  //add to mock DB or array
  jobs.push(newJob);
  //return 201 to indicate job created
  response.status(201).json(newJob);
};

export const deleteJob = (request, response) => {
  //extract job_id from request params
  const { job_id } = request.params;
  //find job in mock DB
  const jobIndex = jobs.findIndex((job) => job.job_id === job_id);
  //if found, remove from mock DB
  if (jobIndex !== -1) {
    jobs.splice(jobIndex, 1);
    //return 204 to indicate no content
    response.status(204).send();
  } else {
    //if not found, return 404
    response.status(404).json({ message: "Job not found" });
  }
};

export const updateJob = (request, response) => {
  //extract job_id from request params
  const { job_id } = request.params;
  //find job in mock DB
  const jobIndex = jobs.findIndex((job) => job.job_id === job_id);
  //if found, update with new data
  if (jobIndex !== -1) {
    // spread operator to merge existing job with new data
    const updatedJob = { ...jobs[jobIndex], ...request.body };
    jobs[jobIndex] = updatedJob;
    response.json(updatedJob);
  } else {
    //if not found, return 404
    response.status(404).json({ message: "Job not found" });
  }
};
