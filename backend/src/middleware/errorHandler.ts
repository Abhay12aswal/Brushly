import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

const errorHandler = (
  err: ApiError | Error, // Accepts both custom and built-in errors
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  let statusCode = 500;
  let message = "Internal Server Error";

  // If it's an instance of ApiError, use its status and message
  if (err instanceof ApiError) {
    statusCode = err.statusCode || 500;
    message = err.message;
  } else {
    message = err.message || message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Hide stack trace in production
  });
};

export { errorHandler };
