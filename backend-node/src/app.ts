import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "./controllers/jobsController";
import { Server } from "http";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE = "/api/node/v1";
// Syntax: "app.[HTTP_METHOD](param1, param2)"
// Param1: string -> API endpoint route literal
// Param2: controller -> fn (request, response) => {parse rquest, return response}

// REST server, register endpoints
app.get(`${API_BASE}/jobs`, getAllJobs);
app.get(`${API_BASE}/jobs/:job_id`, getJobById);
app.post(`${API_BASE}/jobs`, createJob);
app.put(`${API_BASE}/jobs/:job_id`, updateJob);
app.delete(`${API_BASE}/jobs/:job_id`, deleteJob);

const PORT = process.env.PORT || 5050;
const server: Server = app.listen(PORT, (): void => {
  console.error(`Server is running on port ${PORT}`);
});

export default server;
