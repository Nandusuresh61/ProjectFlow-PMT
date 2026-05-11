import mongoose, { Schema, Document } from 'mongoose';

export interface SprintDailyMetricDocument extends Document {
  metricId: string;
  sprintId: string;
  projectId: string;
  workspaceId: string;
  date: Date;
  totalEstimatedHours: number;
  totalLoggedHours: number;
  totalRemainingHours: number;
  completedTasks: number;
  incompleteTasks: number;
  completedStoryPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const SprintDailyMetricSchema: Schema = new Schema({
  metricId: { type: String, required: true, unique: true },
  sprintId: { type: String, required: true, index: true },
  projectId: { type: String, required: true, index: true },
  workspaceId: { type: String, required: true },
  date: { type: Date, required: true },
  totalEstimatedHours: { type: Number, required: true, default: 0 },
  totalLoggedHours: { type: Number, required: true, default: 0 },
  totalRemainingHours: { type: Number, required: true, default: 0 },
  completedTasks: { type: Number, required: true, default: 0 },
  incompleteTasks: { type: Number, required: true, default: 0 },
  completedStoryPoints: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Enforce one snapshot per sprint per day
SprintDailyMetricSchema.index({ sprintId: 1, date: 1 }, { unique: true });

export const SprintDailyMetricModel = mongoose.model<SprintDailyMetricDocument>('SprintDailyMetric', SprintDailyMetricSchema);
