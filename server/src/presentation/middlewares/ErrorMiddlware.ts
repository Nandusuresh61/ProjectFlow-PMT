import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "shared";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: any,
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

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
  });
};
