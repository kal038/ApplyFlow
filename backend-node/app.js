import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "./controllers/jobsController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API = "/api/node/v1";
// TODO GET /api/node/v1/jobs
// Syntax for an endpoint is app.[METHOD](param1, param2) in which
// Param1: string -> API endpoint route literal
// Param2: handler -> function with (request, response) => {do something w/ request and response objecst}

app.get(`${API}/jobs`, getAllJobs);
app.get(`${API}/jobs/:job_id`, getJobById);
app.post(`${API}/jobs`, createJob);
app.put(`${API}/jobs/:job_id`, updateJob);
app.delete(`${API}/jobs/:job_id`, deleteJob);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
