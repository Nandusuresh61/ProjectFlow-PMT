import { MongoNotificationRepository } from "@/infrastructure/repositories/MongoNotificationRepository";
import { CreateNotificationUseCase } from "@/application/use-cases/Notification/CreateNotificationUseCase";
import { GetUserNotificationsUseCase } from "@/application/use-cases/Notification/GetUserNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "@/application/use-cases/Notification/MarkNotificationAsReadUseCase";
import { GetUnreadNotificationCountUseCase } from "@/application/use-cases/Notification/GetUnreadNotificationCountUseCase";
import { NotificationService } from "@/application/services/NotificationService";

export const notificationRepo = new MongoNotificationRepository();
export const createNotificationUseCase = new CreateNotificationUseCase(notificationRepo);
export const getUserNotificationsUseCase = new GetUserNotificationsUseCase(notificationRepo);
export const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepo);
export const getUnreadNotificationCountUseCase = new GetUnreadNotificationCountUseCase(notificationRepo);

export const notificationService = new NotificationService(createNotificationUseCase);
