import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/infrastructure/services/SocketServer";
import { logger } from "@/infrastructure/utils/Logger";

export const NotificationSocketHandler = (io: Server, socket: AuthenticatedSocket) => {
  if (socket.user) {
    const userRoom = `user_notifications_${socket.user.userId}`;
    socket.join(userRoom);
    logger.info(`User ${socket.user.userId} joined notification room ${userRoom}`);
  }

  socket.on("mark_notification_read", (notificationId: string) => {
    if (socket.user) {
      const userRoom = `user_notifications_${socket.user.userId}`;
      socket.to(userRoom).emit("notification:read", notificationId);
    }
  });
};
