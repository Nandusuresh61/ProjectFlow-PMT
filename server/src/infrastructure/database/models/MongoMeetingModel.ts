import mongoose, { Schema, Document } from "mongoose";

export interface MeetingDocument extends Document {
  meetingId: string;
  workspaceId: string;
  hostId: string;
  title: string;
  participants: string[];
  status: string;
  scheduledAt: Date;
  duration: number;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<MeetingDocument>(
  {
    meetingId: { type: String, required: true, unique: true },
    workspaceId: { type: String, required: true, index: true },
    hostId: { type: String, required: true },
    title: { type: String, required: true },
    participants: [{ type: String }],
    status: { 
      type: String, 
      enum: ["PENDING", "ACTIVE", "ENDED"], 
      default: "PENDING" 
    },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const MeetingModel = mongoose.model<MeetingDocument>(
  "Meeting",
  MeetingSchema
);
