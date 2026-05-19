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
