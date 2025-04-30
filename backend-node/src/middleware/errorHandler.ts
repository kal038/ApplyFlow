import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

/**
 * Error handling middleware for Express applications.
 * This middleware catches errors thrown in the application and sends a JSON response
 * Allow us to handle expected app errors (40x) errors and unexpected server errors (50x) errors
 * So bascially, every time we do try {} catch {}, we put "next(error)" in the catch block
 * and this middleware will handle it
 * 400s, the client is at fault. Here's a helpful reason why
 * 500s, the server is at fault. We log it and fix it
 * @param err - The error object thrown in the application
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function in the stack
 */
export function errorHandler(
  err: unknown, // allow for other types of errors to be thrown
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);

  if (err instanceof AppError) {
    // If it's an AppError, we can use its properties
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ message });
    return;
  }

  res.status(500).json({ message: "Unexpected Internal Server Error" });
}
