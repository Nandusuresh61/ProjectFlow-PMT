import { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import { IGetUnreadNotificationCountUseCase } from "@/application/interfaces/use-cases/Notification/IGetUnreadNotificationCountUseCase";

export class GetUnreadNotificationCountUseCase implements IGetUnreadNotificationCountUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(receiverId: string, workspaceId?: string): Promise<number> {
    return await this.notificationRepo.countUnreadByReceiverId(receiverId, workspaceId);
  }
}
