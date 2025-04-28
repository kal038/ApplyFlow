import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/types";

// get rids of res.status(...).json(...) pattern
// replaces with throw new AppError([message], [statusCode]);
export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
}
