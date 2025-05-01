import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function validateCreateJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return next(new AppError("Invalid or missing title", 400));
  }

  next();
}

export function validateUpdateJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title } = req.body;

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return next(new AppError("Invalid or missing 'title'", 400));
  }

  next();
}
