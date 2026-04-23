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
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
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
    subtasks: [
      {
        id: String,
        title: String,
        completed: Boolean,
      },
    ],
    attachments: [AttachmentSchema],
  },
  { timestamps: true }
);

export const IssueModel = mongoose.model<IssueDocument>(
  "Issue",
  IssueSchema
);