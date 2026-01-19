import { Request, Response, NextFunction } from "express";

export interface IAuthController {
  startRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  LogoutUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
