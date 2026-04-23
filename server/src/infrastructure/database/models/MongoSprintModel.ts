import mongoose, { Schema, Document } from "mongoose";

export interface ISprintDocument extends Document {
  sprintId: string;
  projectId: string;
  name: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
  issueIds: string[];
  startDate?: Date;
  endDate?: Date;
  goal?: string;
  plannedPoints?: number;
  completedPoints?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SprintSchema = new Schema<ISprintDocument>(
  {
    sprintId: { type: String, required: true, unique: true },
    projectId: { type: String, required: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["PLANNED", "ACTIVE", "COMPLETED"],
      required: true,
    },
    issueIds: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    goal: { type: String },
    plannedPoints: { type: Number, default: 0 },
    completedPoints: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const SprintModel = mongoose.model<ISprintDocument>(
  "Sprint",
  SprintSchema
);