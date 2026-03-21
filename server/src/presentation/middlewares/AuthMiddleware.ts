import { NextFunction, Request, Response } from "express";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ITokenPayload } from "@/shared/types/user.types";
import { config } from "@/app.config";
import jwt from "jsonwebtoken";
import { UserModel } from "@/infrastructure/database/models/MongoUserModel";

export interface AuthRequest extends Request {
  user?: ITokenPayload;
}

export const authenticatedUser = async (
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
      const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET) as unknown as ITokenPayload;
      
      // Real-time check against database to catch sudden blocks
      const user = await UserModel.findOne({ userId: decoded.userId }).select('isBlocked');
      
      if (!user || user.isBlocked) {
        throw new AppError(
          ErrorCode.AUTH,
          AppMessages.USER_BLOCKED,
          HttpStatusCode.FORBIDDEN,
        );
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
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
