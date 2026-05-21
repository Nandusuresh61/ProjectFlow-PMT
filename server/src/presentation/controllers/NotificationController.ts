import { Response, NextFunction } from "express";
import { AuthRequest } from "@/presentation/middlewares/AuthMiddleware";
import { getUserNotificationsUseCase, markNotificationAsReadUseCase, getUnreadNotificationCountUseCase } from "@/infrastructure/DI/NotificationContainer";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { logger } from "@/infrastructure/utils/Logger";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";

export class NotificationController {
  async getUserNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(ErrorCode.AUTH, "Unauthorized", HttpStatusCode.UNAUTHORIZED);
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const workspaceId = req.query.workspaceId as string | undefined;

      const result = await getUserNotificationsUseCase.execute(userId, page, limit, workspaceId);
      res.status(HttpStatusCode.OK).json({ success: true, data: result });
    } catch (error) {
      logger.error("Error getting user notifications", error);
      next(error);
    }
  }

  async getUnreadCount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(ErrorCode.AUTH, "Unauthorized", HttpStatusCode.UNAUTHORIZED);
      }

      const workspaceId = req.query.workspaceId as string | undefined;
      const count = await getUnreadNotificationCountUseCase.execute(userId, workspaceId);
      res.status(HttpStatusCode.OK).json({ success: true, data: { count } });
    } catch (error) {
      logger.error("Error getting unread notification count", error);
      next(error);
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!userId) {
        throw new AppError(ErrorCode.AUTH, "Unauthorized", HttpStatusCode.UNAUTHORIZED);
      }

      const success = await markNotificationAsReadUseCase.execute(id, userId);
      res.status(HttpStatusCode.OK).json({ success, data: { notificationId: id, isRead: true } });
    } catch (error) {
      logger.error("Error marking notification as read", error);
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
