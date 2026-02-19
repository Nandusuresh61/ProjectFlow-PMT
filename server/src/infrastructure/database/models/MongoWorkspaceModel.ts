import mongoose, { Schema, Document } from "mongoose";

export interface WorkspaceDocument extends Document {
  workspaceId: string;
  name: string;
  ownerId: string;
  planId: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<WorkspaceDocument>(
  {
    workspaceId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    planId: { type: String, required: true },
  },
  { timestamps: true },
);

export const WorkspaceModel = mongoose.model<WorkspaceDocument>(
  "Workspace",
  WorkspaceSchema,
);
