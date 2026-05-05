import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/infrastructure/services/SocketServer";
import { sendMessageUseCase, checkChatAccessUseCase } from "@/infrastructure/DI/ChatContainer";
import { MessageType } from "@/domain/entities/Chat/Message";
import { logger } from "@/infrastructure/utils/Logger";

export const ChatSocketHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("join_room", async (roomId: string) => {
    if (!socket.user) return;

    const hasAccess = await checkChatAccessUseCase.execute(socket.user.userId, roomId);
    if (!hasAccess) {
      logger.warn(`User ${socket.user.userId} attempted to join unauthorized room ${roomId}`);
      socket.emit("error", { message: "Unauthorized access to chat room" });
      return;
    }

    socket.join(roomId);
    logger.info(`User ${socket.user?.userId} joined room ${roomId}`);
  });

  // Leave a specific room
  socket.on("leave_room", (roomId: string) => {
    socket.leave(roomId);
    logger.info(`User ${socket.user?.userId} left room ${roomId}`);
  });

  // Send message
  socket.on("send_message", async (data: { roomId: string; content: string; type?: MessageType }) => {
    logger.debug(`Received send_message event for room ${data.roomId}`, { content: data.content });
    try {
      if (!socket.user) {
        logger.error("User not found on socket during send_message");
        return;
      }

      const hasAccess = await checkChatAccessUseCase.execute(socket.user.userId, data.roomId);
      if (!hasAccess) {
        logger.warn(`User ${socket.user.userId} unauthorized for room ${data.roomId}`);
        socket.emit("error", { message: "Unauthorized to send messages to this room" });
        return;
      }

      logger.debug(`Saving message to DB for room ${data.roomId} by user ${socket.user.userId}`);
      const message = await sendMessageUseCase.execute({
        roomId: data.roomId,
        senderId: socket.user.userId,
        content: data.content,
        type: data.type || MessageType.TEXT,
      });

      logger.info(`Message saved and emitting to room ${data.roomId}`, { messageId: message.messageId });

      io.to(data.roomId).emit("new_message", {
        messageId: message.messageId,
        roomId: message.roomId,
        senderId: message.senderId,
        content: message.content,
        type: message.type,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        senderName: socket.user.fullName,
      });
    } catch (error) {
      logger.error("Error sending message via socket", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("typing", (data: { roomId: string; isTyping: boolean }) => {
    socket.to(data.roomId).emit("user_typing", {
      userId: socket.user?.userId,
      fullName: socket.user?.fullName,
      isTyping: data.isTyping,
    });
  });
};
