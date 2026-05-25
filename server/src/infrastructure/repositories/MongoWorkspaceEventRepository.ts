import { IWorkspaceEventRepository } from "@/application/interfaces/repositories/IWorkspaceEventRepository";
import {
  WorkspaceEvent,
  WorkspaceEventType,
  WorkspaceEventEntityType,
  WorkspaceEventVisibility,
} from "@/domain/entities/WorkspaceEvent";
import { WorkspaceEventModel, WorkspaceEventDocument } from "@/infrastructure/database/models/MongoWorkspaceEventModel";
import { UserModel } from "@/infrastructure/database/models/MongoUserModel";

export class MongoWorkspaceEventRepository implements IWorkspaceEventRepository {
  private mapToDomain(doc: WorkspaceEventDocument, actorName?: string): WorkspaceEvent {
    return new WorkspaceEvent(
      doc.eventId,
      doc.workspaceId,
      doc.actorId,
      doc.eventType as WorkspaceEventType,
      doc.entityType as WorkspaceEventEntityType,
      doc.entityId,
      doc.metadata,
      doc.visibility as WorkspaceEventVisibility,
      doc.parentEntityType as WorkspaceEventEntityType | null,
      doc.parentEntityId,
      doc.projectId,
      doc.createdAt,
      actorName
    );
  }

  async save(event: WorkspaceEvent): Promise<void> {
    const doc = new WorkspaceEventModel({
      eventId: event.eventId,
      workspaceId: event.workspaceId,
      actorId: event.actorId,
      eventType: event.eventType,
      entityType: event.entityType,
      entityId: event.entityId,
      metadata: event.metadata,
      visibility: event.visibility,
      parentEntityType: event.parentEntityType,
      parentEntityId: event.parentEntityId,
      projectId: event.projectId,
      createdAt: event.createdAt,
    });
    await doc.save();
  }

  async getWorkspaceFeed(
    workspaceId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WorkspaceEvent[]> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    const docs = await WorkspaceEventModel.find({ workspaceId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const actorIds = Array.from(new Set(docs.map((doc) => doc.actorId)));
    const users = await UserModel.find({ userId: { $in: actorIds } })
      .select("userId fullName")
      .exec();

    const actorMap = new Map<string, string>();
    users.forEach((u) => actorMap.set(u.userId, u.fullName));

    return docs.map((doc) => this.mapToDomain(doc, actorMap.get(doc.actorId) || doc.actorId));
  }

  async getEntityTimeline(
    entityId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WorkspaceEvent[]> {
    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    const docs = await WorkspaceEventModel.find({ 
      $or: [
        { entityId: entityId },
        { parentEntityId: entityId }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const actorIds = Array.from(new Set(docs.map((doc) => doc.actorId)));
    const users = await UserModel.find({ userId: { $in: actorIds } })
      .select("userId fullName")
      .exec();

    const actorMap = new Map<string, string>();
    users.forEach((u) => actorMap.set(u.userId, u.fullName));

    return docs.map((doc) => this.mapToDomain(doc, actorMap.get(doc.actorId) || doc.actorId));
  }
}
