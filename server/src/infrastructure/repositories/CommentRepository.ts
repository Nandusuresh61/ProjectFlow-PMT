import { ICommentRepository } from "@/application/interfaces/repositories/ICommentRepository";
import { Comment } from "@/domain/entities/Comment";
import { CommentModel, CommentDocument } from "../database/models/MongoCommentModel";

export class CommentRepository implements ICommentRepository {
  async create(comment: Comment): Promise<Comment> {
    const created = await CommentModel.create({
      commentId: comment.commentId,
      issueId: comment.issueId,
      authorId: comment.authorId,
      content: comment.content,
      mentions: comment.mentions,
      attachments: comment.attachments,
    });

    return this.toDomain(created);
  }

  async findByIssueId(issueId: string): Promise<Comment[]> {
    const docs = await CommentModel.find({ issueId }).sort({ createdAt: 1 }).lean();
    return (docs as unknown as CommentDocument[]).map((doc: CommentDocument) => this.toDomain(doc));
  }

  async findById(commentId: string): Promise<Comment | null> {
    const doc = await CommentModel.findOne({ commentId }).lean();
    if (!doc) return null;
    return this.toDomain(doc as unknown as CommentDocument);
  }

  async update(commentId: string, content: string): Promise<Comment | null> {
    const updated = await CommentModel.findOneAndUpdate(
      { commentId },
      { $set: { content } },
      { returnDocument: "after" }
    ).lean();

    if (!updated) return null;
    return this.toDomain(updated as unknown as CommentDocument);
  }

  async delete(commentId: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ commentId });
    return result.deletedCount > 0;
  }

  private toDomain(doc: CommentDocument): Comment {
    return new Comment(
      doc.commentId,
      doc.issueId,
      doc.authorId,
      doc.content,
      doc.createdAt,
      doc.updatedAt,
      doc.mentions || [],
      doc.attachments || []
    );
  }
}
