import { NextFunction, Response, Request } from "express";
import { AppError, ErrorCode, HttpStatusCode, AppMessages } from "shared";
import { TokenPayloadType } from "shared";

interface AuthRequest extends Request {
  user?: TokenPayloadType;
}

export const superAdminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    if (!req.user.isSuperAdmin) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};