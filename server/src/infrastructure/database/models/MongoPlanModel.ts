import { model, Schema, Document } from "mongoose";

export interface PlanDocument extends Document {
  planId: string;
  type: string;
  priceMonthly: number;
  description: string;
  maxProjects: number;
  maxMembers: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<PlanDocument>(
  {
    planId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    priceMonthly: { type: Number, required: true },
    description: { type: String, required: true },
    maxProjects: { type: Number, required: true },
    maxMembers: { type: Number, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const PlanModel = model<PlanDocument>("Plan", planSchema);
