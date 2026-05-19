import mongoose, { Schema, Document } from "mongoose";

export interface WorkspaceEventDocument extends Document {
  eventId: string;
  workspaceId: string;
  actorId: string;
  eventType: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, any>;
  visibility: string;
  parentEntityType: string | null;
  parentEntityId: string | null;
  projectId: string | null;
  createdAt: Date;
}

const WorkspaceEventSchema = new Schema<WorkspaceEventDocument>(
  {
    eventId: { type: String, required: true, unique: true },
    workspaceId: { type: String, required: true },
    actorId: { type: String, required: true },
    eventType: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    visibility: { type: String, default: "PUBLIC" },
    parentEntityType: { type: String, default: null },
    parentEntityId: { type: String, default: null },
    projectId: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Required Indexes for optimization
WorkspaceEventSchema.index({ workspaceId: 1, createdAt: -1 });
WorkspaceEventSchema.index({ entityId: 1, createdAt: -1 });
WorkspaceEventSchema.index({ actorId: 1, createdAt: -1 });
WorkspaceEventSchema.index({ projectId: 1, createdAt: -1 });
WorkspaceEventSchema.index({ eventType: 1 });

export const WorkspaceEventModel = mongoose.model<WorkspaceEventDocument>(
  "WorkspaceEvent",
  WorkspaceEventSchema
);
