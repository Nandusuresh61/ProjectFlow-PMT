import { Notification } from "@/domain/entities/Notification";
import { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import { ICreateNotificationUseCase } from "@/application/interfaces/use-cases/Notification/ICreateNotificationUseCase";
import { CreateNotificationDTO } from "@/application/dtos/NotificationDto";
import crypto from "crypto";

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(data: CreateNotificationDTO): Promise<Notification> {
    const notification = new Notification(
      crypto.randomUUID(),
      data.receiverId,
      data.workspaceId,
      data.type,
      data.title,
      data.message,
      false,
      new Date(),
      data.projectId
    );

    return await this.notificationRepo.create(notification);
  }
}
