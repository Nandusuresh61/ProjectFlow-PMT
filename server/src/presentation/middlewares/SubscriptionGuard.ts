import { Request, Response, NextFunction } from "express";
import { subscriptionRepo } from "@/infrastructure/DI/SubscriptionContainer";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { SubscriptionStatus } from "@/shared/enums/SubscriptionStatus";
import { AppMessages } from "@/shared/messages/AppMessages";

export const subscriptionGuard = async (req: Request, res: Response, next: NextFunction) => {
  const workspaceId = req.headers["x-workspace-id"] as string || req.params.workspaceId || req.body.workspaceId;

  if (!workspaceId) {
    return next(new AppError(ErrorCode.VALIDATION_ERROR, AppMessages.WORKSPACE_ID_REQUIRED, HttpStatusCode.BAD_REQUEST));
  }

  const subscription = await subscriptionRepo.findByWorkspaceId(workspaceId);

  if (!subscription) {
    return next(new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.SUBSCRIPTION_NOT_FOUND, HttpStatusCode.NOT_FOUND));
  }

  // Skip guard for super admins
  if ((req as any).user?.isSuperAdmin) {
    return next();
  }

  if (!subscription.isActive()) {
    return next(new AppError(ErrorCode.PLAN, AppMessages.SUBSCRIPTION_EXPIRED, HttpStatusCode.PAYMENT_REQUIRED));
  }

  next();
};
