import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};
