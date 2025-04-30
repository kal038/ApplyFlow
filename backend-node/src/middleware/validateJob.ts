import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function validateCreateJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return next(new AppError("Invalid or missing 'title'", 400));
  }
  if (typeof description !== "string" || description.trim() === "") {
    return next(new AppError("Invalid or missing 'description'", 400));
  }

  next();
}

export function validateUpdateJob(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description } = req.body;

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return next(new AppError("Invalid or missing 'title'", 400));
  }
  if (
    description !== undefined &&
    (typeof description !== "string" || description.trim() === "")
  ) {
    return next(new AppError("Invalid description'", 400));
  }

  next();
}
