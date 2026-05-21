import { INotificationRepository } from "@/domain/repositories/INotificationRepository";

export class MarkNotificationAsReadUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(notificationId: string, receiverId: string): Promise<boolean> {
    return await this.notificationRepo.markAsRead(notificationId, receiverId);
  }
}
