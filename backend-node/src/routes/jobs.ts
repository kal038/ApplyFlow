import { Router } from "express";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} from "@/controllers/jobsController";
import { authenticateJWT } from "../middleware/authenticate";
import { validateCreateJob, validateUpdateJob } from "@/middleware/validateJob";

export const router = Router();

router.get("/", authenticateJWT, getAllJobs);
router.post("/", authenticateJWT, validateCreateJob, createJob);
router.put("/:job_id", authenticateJWT, validateUpdateJob, updateJob);
router.delete("/:job_id", authenticateJWT, deleteJob);
