import { NotificationType } from "@/domain/entities/Notification";

export interface CreateNotificationDTO {
  receiverId: string;
  workspaceId: string;
  type: NotificationType;
  title: string;
  message: string;
  projectId?: string;
}
