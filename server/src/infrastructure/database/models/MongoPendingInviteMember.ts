import { PendingInvite } from "@/domain/entities/workspace/Workspace";
import mongoose, { Schema } from "mongoose";

const pendingInviteSchema = new Schema<PendingInvite & Document>({
  pendingInviteId: { type: String, required: true, unique: true },
  workspaceId: { type: String, required: true },
  invitedEmail: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Member"], default: "Member" },
  invitedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
export const PendingInviteModel = mongoose.model<PendingInvite & Document>(
  "PendingInvite",
  pendingInviteSchema,
);
