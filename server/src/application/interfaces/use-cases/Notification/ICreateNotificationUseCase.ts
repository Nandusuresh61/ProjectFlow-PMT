import { Notification } from "@/domain/entities/Notification";
import { CreateNotificationDTO } from "@/application/dtos/NotificationDto";

export interface ICreateNotificationUseCase {
  execute(data: CreateNotificationDTO): Promise<Notification>;
}
