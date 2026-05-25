import { CreateNotificationUseCase } from "@/application/use-cases/Notification/CreateNotificationUseCase";
import { NotificationType } from "@/domain/entities/Notification";
import { SocketServer } from "@/infrastructure/services/SocketServer";

export class NotificationService {
  constructor(private readonly createNotificationUseCase: CreateNotificationUseCase) {}

  async sendNotification(data: {
    receiverId: string;
    workspaceId: string;
    type: NotificationType;
    title: string;
    message: string;
    projectId?: string;
  }) {
    const notification = await this.createNotificationUseCase.execute(data);

    const io = SocketServer.getInstance().getIO();
    const userRoom = `user_notifications_${data.receiverId}`;
    
    io.to(userRoom).emit("notification:new", notification);
    
    return notification;
  }
}
