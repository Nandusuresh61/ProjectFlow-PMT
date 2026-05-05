import { Schema, model, Document } from "mongoose";
import { SubscriptionStatus } from "@/shared/enums/SubscriptionStatus";

export interface SubscriptionDoc extends Document {
  subscriptionId: string;
  workspaceId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  billingCycle: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<SubscriptionDoc>(
  {
    subscriptionId: { type: String, required: true, unique: true },
    workspaceId: { type: String, required: true, index: true },
    planId: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    billingCycle: { type: String, default: "monthly" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

export const MongoSubscriptionModel = model<SubscriptionDoc>("Subscription", subscriptionSchema);
