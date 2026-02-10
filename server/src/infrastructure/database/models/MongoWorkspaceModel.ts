import { Workspace } from "@/domain/entities/workspace/Workspace";
import mongoose, { Document, Schema } from "mongoose";

const workspaceSchema = new Schema<Workspace & Document>(
  {
    workspaceId: { type: String, required: true },
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
  },
  { timestamps: true },
);

export const WorkspaceModel = mongoose.model<Workspace & Document>("Workspace", workspaceSchema);