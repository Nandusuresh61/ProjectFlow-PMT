import { Request, Response, NextFunction } from "express";

export interface IOnboardingController {
  completeOnboarding(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getOnboardingStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}