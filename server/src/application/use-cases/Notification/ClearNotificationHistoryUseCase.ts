import { INotificationRepository } from "@/domain/repositories/INotificationRepository";
import { IClearNotificationHistoryUseCase } from "@/application/interfaces/use-cases/Notification/IClearNotificationHistoryUseCase";

export class ClearNotificationHistoryUseCase implements IClearNotificationHistoryUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(receiverId: string, workspaceId?: string): Promise<boolean> {
    return await this.notificationRepo.clearHistory(receiverId, workspaceId);
  }
}
