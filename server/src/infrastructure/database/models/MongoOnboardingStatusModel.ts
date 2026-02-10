import { OnboardingStatus } from "@/domain/entities/Onboarding/OnboardingStatus";
import mongoose, { Document, Schema } from "mongoose";

const onboardingStatusSchema = new Schema<OnboardingStatus & Document>({
  userId: { type: String, required: true, unique: true },
  isCompleted: { type: Boolean, default: false },
  workspaceId: { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
});

export const OnboardingStatusModel = mongoose.model<OnboardingStatus & Document>(
  "OnboardingStatus",
  onboardingStatusSchema,
);