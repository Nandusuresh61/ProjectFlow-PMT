import mongoose, { Schema, Document } from "mongoose";
import { InvitationStatus } from "shared";
import { WorkspaceRoleEnum } from "shared";

export interface InvitationDocument extends Document {
  invitationId: string;
  email: string;
  workspaceId: string;
  role: WorkspaceRoleEnum;
  tokenHash: string;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
}

const InvitationSchema = new Schema<InvitationDocument>({
  invitationId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  workspaceId: {
    type: String,
    required: true,
    index: true,
  },
  role: {
    type: String,
    required: true,
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: Object.values(InvitationStatus),
    default: InvitationStatus.PENDING,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

/**
 * Optional: Auto delete expired invitations
 * Mongo TTL index
 */
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const InvitationModel = mongoose.model<InvitationDocument>(
  "Invitation",
  InvitationSchema
);