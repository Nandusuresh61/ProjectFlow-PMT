import mongoose, { Schema, Document } from "mongoose";
import { OrganizationRoleEnum } from "shared";

export interface MembershipDocument extends Document {
  membershipId: string;
  userId: string;
  organizationId: string;
  role: OrganizationRoleEnum;
  joinedAt: Date;
}

const MembershipSchema = new Schema<MembershipDocument>({
  membershipId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  organizationId: { type: String, required: true },
  role: { type: String, required: true },
  joinedAt: { type: Date, required: true },
});

export const MembershipModel = mongoose.model<MembershipDocument>(
  "Membership",
  MembershipSchema
);