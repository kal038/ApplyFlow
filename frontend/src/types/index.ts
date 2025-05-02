export interface User {
  user_id: string;
  email: string;
}

export interface Job {
  job_id: string;
  company: string;
  title: string;
  status: string;
  applied_date: string;
  notes?: string;
}

export type JobStatus =
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Wishlisted"
  | "Archived";

export type ViewMode = "grid" | "cards";
