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
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorHandler } from "@/middleware/errorHandler";

/*
 *taxonomy of the app
 *app.ts → entry point
 *server.ts → server configuration
 *config/ → configuration files
 *middleware/ → middleware functions
 *routes/ → URL & HTTP verbs
 *controllers/ → request handling logic
 *services/ → business logic & data operations & external API calls
 *utils/ → utility functions
 *types/ → type definitions
 *tests/ → unit tests
 *assets/ → static assets
 *public/ → public assets
 */

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const API_BASE = "/api/node/v1";
// Syntax: "app.[HTTP_METHOD](param1, param2)"
// Param1: string -> API endpoint route literal
// Param2: controller -> fn (request, response) => {parse rquest, return response}

// TODO: refactor to jobs routers
app.get(`${API_BASE}/jobs`, getAllJobs);
app.get(`${API_BASE}/jobs/:job_id`, getJobById);
app.post(`${API_BASE}/jobs`, createJob);
app.put(`${API_BASE}/jobs/:job_id`, updateJob);
app.delete(`${API_BASE}/jobs/:job_id`, deleteJob);

// Global error handler
app.use(errorHandler);

export default app;
