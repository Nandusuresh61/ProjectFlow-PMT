import mongoose, { Schema, Document } from "mongoose";

export interface WorkLogDocument extends Document {
  workLogId: string;
  issueId: string;
  userId: string;
  hours: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const WorkLogSchema = new Schema<WorkLogDocument>(
  {
    workLogId: { type: String, required: true, unique: true },
    issueId: { type: String, required: true },
    userId: { type: String, required: true },
    hours: { type: Number, required: true },
    note: { type: String, default: null },
  },
  { timestamps: true }
);

export const WorkLogModel = mongoose.model<WorkLogDocument>(
  "WorkLog",
  WorkLogSchema
);
