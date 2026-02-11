import { model, Schema } from "mongoose";

const planSchema = new Schema(
  {
    planId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    priceMonthly: { type: Number, required: true },
    description: { type: String, required: true },
    maxProjects: { type: Number, required: true },
    maxMembers: { type: Number, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const PlanModel = model("Plan", planSchema);
