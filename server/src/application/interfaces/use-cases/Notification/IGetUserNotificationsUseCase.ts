import { Notification } from "@/domain/entities/Notification";

export interface IGetUserNotificationsUseCase {
  execute(receiverId: string, page?: number, limit?: number, workspaceId?: string): Promise<{ notifications: Notification[]; totalUnread: number }>;
}
