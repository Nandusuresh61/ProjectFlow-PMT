import { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import { IMarkNotificationAsReadUseCase } from "@/application/interfaces/use-cases/Notification/IMarkNotificationAsReadUseCase";

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(notificationId: string, receiverId: string): Promise<boolean> {
    return await this.notificationRepo.markAsRead(notificationId, receiverId);
  }
}
