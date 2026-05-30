import { NotificationRepository } from "@/infrastructure/repositories/NotificationRepository";
import { CreateNotificationUseCase } from "@/application/use-cases/Notification/CreateNotificationUseCase";
import { GetUserNotificationsUseCase } from "@/application/use-cases/Notification/GetUserNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "@/application/use-cases/Notification/MarkNotificationAsReadUseCase";
import { GetUnreadNotificationCountUseCase } from "@/application/use-cases/Notification/GetUnreadNotificationCountUseCase";
import { ClearNotificationHistoryUseCase } from "@/application/use-cases/Notification/ClearNotificationHistoryUseCase";
import { NotificationService } from "@/application/services/NotificationService";
import { NotificationController } from "@/presentation/controllers/NotificationController";

export const notificationRepo = new NotificationRepository();
export const createNotificationUseCase = new CreateNotificationUseCase(notificationRepo);
export const getUserNotificationsUseCase = new GetUserNotificationsUseCase(notificationRepo);
export const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepo);
export const getUnreadNotificationCountUseCase = new GetUnreadNotificationCountUseCase(notificationRepo);
export const clearNotificationHistoryUseCase = new ClearNotificationHistoryUseCase(notificationRepo);

export const notificationService = new NotificationService(createNotificationUseCase);

export const notificationController = new NotificationController(
  getUserNotificationsUseCase,
  getUnreadNotificationCountUseCase,
  markNotificationAsReadUseCase,
  clearNotificationHistoryUseCase
);
