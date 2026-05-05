import mongoose, { Schema, Document } from "mongoose";

export interface CommentDocument extends Document {
  commentId: string;
  issueId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentDocument>(
  {
    commentId: { type: String, required: true, unique: true },
    issueId: { type: String, required: true, index: true },
    authorId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model<CommentDocument>("Comment", CommentSchema);
