import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/infrastructure/services/SocketServer";
import { logger } from "@/infrastructure/utils/Logger";
import { MembershipRepository } from "@/infrastructure/repositories/MongoMembershipRepository";

const membershipRepo = new MembershipRepository();

export const ActivitySocketHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("join_workspace_activity", async (workspaceId: string) => {
    if (!socket.user) return;

    try {
      const membership = await membershipRepo.findByUserAndWorkspace(
        socket.user.userId,
        workspaceId
      );

      if (!membership) {
        logger.warn(`User ${socket.user.userId} attempted to join unauthorized workspace activity ${workspaceId}`);
        socket.emit("error", { message: "Unauthorized for workspace activity" });
        return;
      }

      const roomName = `workspace_activity_${workspaceId}`;
      socket.join(roomName);
      logger.info(`User ${socket.user.userId} joined room ${roomName}`);
    } catch (error) {
      logger.error("Error joining workspace activity room", error);
    }
  });

  socket.on("leave_workspace_activity", (workspaceId: string) => {
    const roomName = `workspace_activity_${workspaceId}`;
    socket.leave(roomName);
    logger.info(`User ${socket.user?.userId} left room ${roomName}`);
  });
};
