import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/infrastructure/services/SocketServer";
import { logger } from "@/infrastructure/utils/Logger";

export const MeetingSocketHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("join-meeting", (meetingId: string) => {
    if (!socket.user) return;
    socket.join(`meeting:${meetingId}`);
    logger.info(`User ${socket.user.userId} joined meeting room ${meetingId}`);
    
    // Notify others in the room
    socket.to(`meeting:${meetingId}`).emit("user-joined", {
      userId: socket.user.userId,
      socketId: socket.id,
      fullName: socket.user.fullName
    });
  });

  socket.on("leave-meeting", (meetingId: string) => {
    if (!socket.user) return;
    socket.leave(`meeting:${meetingId}`);
    logger.info(`User ${socket.user.userId} left meeting room ${meetingId}`);
    
    socket.to(`meeting:${meetingId}`).emit("user-left", {
      userId: socket.user.userId,
      socketId: socket.id
    });
  });

  socket.on("webrtc-offer", (data: { targetSocketId: string, meetingId: string, offer: any }) => {
    socket.to(data.targetSocketId).emit("receive-offer", {
      senderSocketId: socket.id,
      userId: socket.user?.userId,
      fullName: socket.user?.fullName,
      offer: data.offer
    });
  });

  socket.on("webrtc-answer", (data: { targetSocketId: string, meetingId: string, answer: any }) => {
    socket.to(data.targetSocketId).emit("receive-answer", {
      senderSocketId: socket.id,
      userId: socket.user?.userId,
      fullName: socket.user?.fullName,
      answer: data.answer
    });
  });

  socket.on("ice-candidate", (data: { targetSocketId: string, meetingId: string, candidate: any }) => {
    socket.to(data.targetSocketId).emit("receive-ice-candidate", {
      senderSocketId: socket.id,
      userId: socket.user?.userId,
      candidate: data.candidate
    });
  });

  socket.on("toggle-mic", (data: { meetingId: string, isMicOn: boolean }) => {
    socket.to(`meeting:${data.meetingId}`).emit("participant-updated", {
      userId: socket.user?.userId,
      isMicOn: data.isMicOn
    });
  });

  socket.on("toggle-camera", (data: { meetingId: string, isCameraOn: boolean }) => {
    socket.to(`meeting:${data.meetingId}`).emit("participant-updated", {
      userId: socket.user?.userId,
      isCameraOn: data.isCameraOn
    });
  });
};
