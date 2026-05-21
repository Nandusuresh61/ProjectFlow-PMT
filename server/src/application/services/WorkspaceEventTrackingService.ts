import { IWorkspaceEventRepository } from "@/application/interfaces/repositories/IWorkspaceEventRepository";
import {
  WorkspaceEvent,
  WorkspaceEventType,
  WorkspaceEventEntityType,
  WorkspaceEventVisibility,
} from "@/domain/entities/WorkspaceEvent";
import crypto from "crypto";
import { SocketServer } from "@/infrastructure/services/SocketServer";

import mongoose from "mongoose";
import { notificationService } from "@/infrastructure/DI/NotificationContainer";
import { NotificationType } from "@/domain/entities/Notification";

export interface TrackEventParams {
  workspaceId: string;
  actorId: string;
  eventType: WorkspaceEventType;
  entityType: WorkspaceEventEntityType;
  entityId: string;
  metadata?: Record<string, any>;
  visibility?: WorkspaceEventVisibility;
  parentEntityType?: WorkspaceEventEntityType | null;
  parentEntityId?: string | null;
  projectId?: string | null;
}

export class WorkspaceEventTrackingService {
  constructor(private readonly eventRepository: IWorkspaceEventRepository) {}

  async trackEvent(params: TrackEventParams): Promise<void> {
    try {
      const eventId = `evt_${crypto.randomUUID()}`;
      
      let actorName = params.actorId;
      try {
        const user = await mongoose.model("User").findOne({ userId: params.actorId }).select("fullName").exec();
        if (user) {
          actorName = (user as any).fullName;
        }
      } catch (userError) {
        console.error("[WorkspaceEventTrackingService] Failed to resolve actor name:", userError);
      }

      const event = new WorkspaceEvent(
        eventId,
        params.workspaceId,
        params.actorId,
        params.eventType,
        params.entityType,
        params.entityId,
        params.metadata || {},
        params.visibility || "PUBLIC",
        params.parentEntityType || null,
        params.parentEntityId || null,
        params.projectId || null,
        new Date(),
        actorName
      );

      await this.eventRepository.save(event);

      // Notification Dispatch Logic
      try {
        const notificationsToSend: { receiverId: string, type: NotificationType, title: string, message: string }[] = [];

        if (params.eventType === "ISSUE_ASSIGNED" && params.metadata?.assigneeId && params.metadata?.assigneeId !== params.actorId) {
          notificationsToSend.push({
            receiverId: params.metadata.assigneeId,
            type: NotificationType.ISSUE_ASSIGNED,
            title: "Issue Assigned",
            message: `You were assigned to issue ${params.metadata.issueKey || 'Unknown'}`
          });
        } else if (params.eventType === "MEMBER_INVITED" && params.metadata?.email) {
          const user = await mongoose.model("User").findOne({ email: params.metadata.email }).select("userId").exec();
          if (user) {
            notificationsToSend.push({
              receiverId: (user as any).userId,
              type: NotificationType.WORKSPACE_INVITE,
              title: "Workspace Invitation",
              message: `You have been invited to a new workspace`
            });
          }
        } else if (params.eventType === "ISSUE_COMMENT_ADDED") {
          // If the issue has an assignee and they are not the commenter
          if (params.metadata?.assigneeId && params.metadata.assigneeId !== params.actorId) {
            notificationsToSend.push({
              receiverId: params.metadata.assigneeId,
              type: NotificationType.ISSUE_COMMENT,
              title: "New Comment",
              message: `New comment on issue ${params.metadata.issueKey || 'Unknown'}`
            });
          }
          
          // Handle mentions
          if (params.metadata?.mentions && Array.isArray(params.metadata.mentions)) {
            for (const mentionUserId of params.metadata.mentions) {
              if (mentionUserId !== params.actorId && mentionUserId !== params.metadata?.assigneeId) {
                notificationsToSend.push({
                  receiverId: mentionUserId,
                  type: NotificationType.MENTION,
                  title: "You were mentioned",
                  message: `You were mentioned in a comment on issue ${params.metadata.issueKey || 'Unknown'}`
                });
              }
            }
          }
        } else if (params.eventType === "TICKET_REPLIED" && params.metadata?.creatorId && params.metadata.creatorId !== params.actorId) {
          notificationsToSend.push({
            receiverId: params.metadata.creatorId,
            type: NotificationType.TICKET_REPLY,
            title: "Ticket Reply",
            message: `New reply on your ticket`
          });
        }

        for (const notif of notificationsToSend) {
          await notificationService.sendNotification({
            receiverId: notif.receiverId,
            workspaceId: params.workspaceId,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            projectId: params.projectId || undefined
          });
        }
      } catch (notifErr) {
        console.error("[WorkspaceEventTrackingService] Failed to send notification:", notifErr);
      }

      // Emit real-time event to connected clients in the workspace room
      try {
        const io = SocketServer.getInstance().getIO();
        io.to(`workspace_activity_${params.workspaceId}`).emit("new_activity", event);
      } catch (socketError) {
        console.error("[WorkspaceEventTrackingService] Failed to emit socket event:", socketError);
      }
    } catch (error) {
      // We shouldn't throw errors from the tracking service to prevent
      // blocking the main business operation if tracking fails
      console.error("[WorkspaceEventTrackingService] Failed to track event:", error);
    }
  }
}
