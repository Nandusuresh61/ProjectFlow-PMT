import { WorkspaceMember } from "@/domain/entities/workspace/Workspace";
import mongoose, { Schema } from "mongoose";

const workspaceMemberSchema = new Schema<WorkspaceMember & Document>({
  workspaceMemberId: { type: String, required: true, unique: true },
  workspaceId: { type: String, required: true },
  userId: { type: String, required: true },
  role: { type: String, enum: ["Owner", "Admin", "Member"], default: "Member" },
  joinedAt: { type: Date, default: Date.now },
});
export const WorkspaceMemberModel = mongoose.model<WorkspaceMember & Document>(
  "WorkspaceMember",
  workspaceMemberSchema,
);