import mongoose, { Document, Schema } from "mongoose";

export interface ProjectDocument extends Document {
  projectId: string;
  projectKey: string;
  name: string;
  description: string | null;
  workspaceId: string;
  createdBy: string;
  memberIds: string[];
  status: "ACTIVE" | "ARCHIVED";
  issueSequence: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    projectId: { type: String, required: true, unique: true },
    projectKey: { type: String, required: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    workspaceId: { type: String, required: true, index: true },
    createdBy: { type: String, required: true },
    memberIds: {
      type: [String],
      default: [],
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
      required: true,
    },
    issueSequence: {
      type: Number,
      default: 1,
      required: true,
    },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<ProjectDocument>(
  "Project",
  ProjectSchema
);
