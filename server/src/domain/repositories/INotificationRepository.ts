import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findByReceiverId(receiverId: string, skip: number, limit: number, workspaceId?: string): Promise<Notification[]>;
  countUnreadByReceiverId(receiverId: string, workspaceId?: string): Promise<number>;
  markAsRead(notificationId: string, receiverId: string): Promise<boolean>;
}
