import mongoose, { Schema, Document } from "mongoose";

export interface IssueDocument extends Document {
  issueId: string;
  issueKey: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  sizeLabel: string | null;
  storyPoints: number | null;
  assigneeId: string | null;
  sprintId: string | null;
  projectId: string;
  workspaceId: string;
  parentId: string | null;
  taskIds: string[];
  acceptanceCriteria: string[];
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
  estimatedHours: number | null;
  remainingHours: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ["IMAGE", "PDF", "LINK"], required: true },
}, { _id: false });

const IssueSchema = new Schema<IssueDocument>(
  {
    issueId: { type: String, required: true },
    issueKey: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    sizeLabel: { type: String, default: null },
    storyPoints: { type: Number, default: null },
    assigneeId: { type: String, default: null },
    sprintId: { type: String, default: null },
    projectId: { type: String, required: true },
    workspaceId: { type: String, required: true },
    parentId: { type: String, default: null },
    taskIds: { type: [String], default: [] },
    acceptanceCriteria: { type: [String], default: [] },
    attachments: [AttachmentSchema],
    estimatedHours: { type: Number, default: null },
    remainingHours: { type: Number, default: null },
  },
  { timestamps: true }
);

export const IssueModel = mongoose.model<IssueDocument>(
  "Issue",
  IssueSchema
);