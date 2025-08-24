import { Router } from "express";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} from "@/controllers/jobsController";
import { authenticateJWT } from "../middleware/authenticate";
import { validateCreateJob, validateUpdateJob } from "@/middleware/validateJob";
import { checkStaleJob } from "@/middleware/checkStaleJob";

export const router = Router();

router.get("/", authenticateJWT, getAllJobs);
router.post("/", authenticateJWT, validateCreateJob, createJob);
// Block updates/deletes if stale
router.put(
  "/:job_id",
  authenticateJWT,
  checkStaleJob(true),
  validateUpdateJob,
  updateJob
);
router.delete(
  "/:job_id",
  authenticateJWT,
  checkStaleJob(true),
  deleteJob
);
