import mongoose, { Schema, Document } from "mongoose";

export interface OrganizationDocument extends Document {
  organizationId: string;
  name: string;
  ownerId: string;
  planId: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<OrganizationDocument>(
  {
    organizationId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    planId: { type: String, required: true },
  },
  { timestamps: true },
);

export const OrganizationModel = mongoose.model<OrganizationDocument>(
  "Organization",
  OrganizationSchema,
);
