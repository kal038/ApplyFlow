import { nanoid } from "nanoid";

export function generateJobId(): string {
  // Generate a unique job ID using nanoid
  return `job-${nanoid(10)}`;
}
