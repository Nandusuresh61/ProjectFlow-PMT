import { INotificationRepository } from "@/domain/repositories/INotificationRepository";

export class GetUnreadNotificationCountUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(receiverId: string, workspaceId?: string): Promise<number> {
    return await this.notificationRepo.countUnreadByReceiverId(receiverId, workspaceId);
  }
}
