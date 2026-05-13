import { Comment } from "@/domain/entities/Comment";

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  findByIssueId(issueId: string): Promise<Comment[]>;
  findById(commentId: string): Promise<Comment | null>;
  update(commentId: string, content: string): Promise<Comment | null>;
  delete(commentId: string): Promise<boolean>;
}
