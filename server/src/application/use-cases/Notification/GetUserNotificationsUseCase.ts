import { Notification } from "@/domain/entities/Notification";
import { INotificationRepository } from "@/domain/repositories/INotificationRepository";

export class GetUserNotificationsUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(receiverId: string, page: number = 1, limit: number = 20, workspaceId?: string): Promise<{ notifications: Notification[]; totalUnread: number }> {
    const skip = (page - 1) * limit;
    const [notifications, totalUnread] = await Promise.all([
      this.notificationRepo.findByReceiverId(receiverId, skip, limit, workspaceId),
      this.notificationRepo.countUnreadByReceiverId(receiverId, workspaceId)
    ]);
    
    return { notifications, totalUnread };
  }
}
