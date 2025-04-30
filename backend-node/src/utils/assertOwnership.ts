import { LineJob } from "@/types"; // Adjust path if needed
import { AppError } from "@/utils/AppError"; // Assuming you have AppError already

export function assertOwnership(job: LineJob, userId: string): void {
  if (job.user_id !== userId) {
    throw new AppError("Access denied: not your job", 403);
  }
}
