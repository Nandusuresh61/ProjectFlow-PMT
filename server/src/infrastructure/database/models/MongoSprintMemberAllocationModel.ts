import mongoose, { Schema, Document } from "mongoose";

export interface SprintMemberAllocationDocument extends Document {
  allocationId: string;
  sprintId: string;
  projectId: string;
  workspaceId: string;
  userId: string;
  assignedHours: number;
  loggedHours: number;
  remainingHours: number;
  completedTasks: number;
  incompleteTasks: number;
  capacityStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const SprintMemberAllocationSchema = new Schema<SprintMemberAllocationDocument>(
  {
    allocationId: { type: String, required: true, unique: true },
    sprintId: { type: String, required: true, index: true },
    projectId: { type: String, required: true, index: true },
    workspaceId: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    assignedHours: { type: Number, default: 0 },
    loggedHours: { type: Number, default: 0 },
    remainingHours: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    incompleteTasks: { type: Number, default: 0 },
    capacityStatus: { 
      type: String, 
      enum: ["UNDERLOADED", "HEALTHY", "OVERLOADED"],
      default: "HEALTHY"
    },
  },
  { timestamps: true }
);

// Enforce one allocation record per user per sprint
SprintMemberAllocationSchema.index({ sprintId: 1, userId: 1 }, { unique: true });

export const SprintMemberAllocationModel = mongoose.model<SprintMemberAllocationDocument>(
  "SprintMemberAllocation",
  SprintMemberAllocationSchema
);
