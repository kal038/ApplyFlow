import { Request } from "express";

export interface User {
  user_id: string;
  email: string;
  name?: string;
  password_hash: string;
  created_at: string;
}

export interface LineJob {
  job_id: string;
  user_id: string;
  company: string;
  title: string;
  status: string;
  applied_date: string;
  notes?: string;
}

export interface AuthUser {
  user_id: string;
  email: string;
}
//request with a user property
export interface AuthRequest extends Request {
  user?: AuthUser;
}
