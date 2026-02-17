import { NextFunction, Request, Response } from "express";
import { AppError, ErrorCode, HttpStatusCode, AppMessages } from "shared";
import { config } from "@/app.config";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const authenticatedUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    try {
      const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.TOKEN_EXPIRED,
        HttpStatusCode.UNAUTHORIZED,
      );
    }
  } catch (error) {
    next(error);
  }
};
