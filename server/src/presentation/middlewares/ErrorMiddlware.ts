import { AppError, HttpStatusCode } from "shared";
import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof ZodError) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      success: false,
      message: err.issues[0]?.message || "Invalid input",
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      errorCode: err.errorCode,
      message: err.message,
    });
  }
  console.error("Unhandled Error:", err);

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
  });
};
