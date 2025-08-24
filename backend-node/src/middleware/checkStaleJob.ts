import { Request, Response, NextFunction } from "express";
import { getJobById } from "@/services/jobService";
import { AppError } from "@/utils/AppError";
import { assertOwnership } from "@/utils/assertOwnership";

// Default threshold (e.g., 3 days) can be overridden by env STALE_JOB_DAYS
const STALE_THRESHOLD_DAYS = Number(process.env.STALE_JOB_DAYS || 3);
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Middleware: fetches job, asserts ownership, and attaches staleness info to request.
 * If job is stale it still allows read by default but blocks mutation returning 410.
 * You can adjust behavior by providing blockOnStale=true when wrapping.
 */
export function checkStaleJob(blockOnStale = false) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { job_id } = req.params;
    if (!job_id) return next(new AppError("Missing job_id param", 400));

    try {
      const job = await getJobById(job_id);
      if (!job) return next(new AppError("Job not found", 404));

      // Ownership (requires authenticateJWT before this middleware)
      const authUser = req.user as { user_id: string } | undefined;
      if (authUser) assertOwnership(job, authUser.user_id);

      const ageDays = (Date.now() - job.last_updated_at) / MS_PER_DAY;
      const isStale = ageDays >= STALE_THRESHOLD_DAYS;

      // Attach metadata for downstream handlers
      (req as any).jobRecord = job;
      (req as any).jobIsStale = isStale;

      if (isStale && blockOnStale) {
        return next(new AppError("Job is stale", 410));
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

/** Utility for controllers to reuse stale calculation if needed */
export function isStaleTimestamp(lastUpdatedAt: number): boolean {
  return Date.now() - lastUpdatedAt >= STALE_THRESHOLD_DAYS * MS_PER_DAY;
}
