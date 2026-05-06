import mongoose, { Document, Schema } from "mongoose";

export interface ISprintAnalyticsDocument extends Document {
  analyticsId: string;
  sprintId: string;
  projectId: string;
  workspaceId: string;
  sprintName: string;
  sprintGoal: string | null;
  startedAt: Date;
  completedAt: Date;
  committedIssues: number;
  completedIssues: number;
  incompleteIssues: number;
  committedStoryPoints: number;
  completedStoryPoints: number;
  spilloverStoryPoints: number;
  committedEstimatedHours: number;
  loggedHours: number;
  remainingHours: number;
  completionRate: number;
  velocity: number;
  scopeChangeCount: number;
  createdAt: Date;
}

const SprintAnalyticsSchema = new Schema<ISprintAnalyticsDocument>(
  {
    analyticsId: { type: String, required: true, unique: true },
    sprintId: { type: String, required: true },
    projectId: { type: String, required: true },
    workspaceId: { type: String, required: true },
    sprintName: { type: String, required: true },
    sprintGoal: { type: String, default: null },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, required: true },
    committedIssues: { type: Number, required: true },
    completedIssues: { type: Number, required: true },
    incompleteIssues: { type: Number, required: true },
    committedStoryPoints: { type: Number, required: true },
    completedStoryPoints: { type: Number, required: true },
    spilloverStoryPoints: { type: Number, required: true },
    committedEstimatedHours: { type: Number, required: true },
    loggedHours: { type: Number, required: true },
    remainingHours: { type: Number, required: true },
    completionRate: { type: Number, required: true },
    velocity: { type: Number, required: true },
    scopeChangeCount: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, required: true },
  },
  {
    versionKey: false,
  },
);

SprintAnalyticsSchema.index({ sprintId: 1 }, { unique: true });
SprintAnalyticsSchema.index({ projectId: 1 });
SprintAnalyticsSchema.index({ workspaceId: 1 });
SprintAnalyticsSchema.index({ completedAt: -1 });

export const SprintAnalyticsModel = mongoose.model<ISprintAnalyticsDocument>(
  "SprintAnalytics",
  SprintAnalyticsSchema,
);
