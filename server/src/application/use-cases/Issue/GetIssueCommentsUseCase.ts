import { IGetIssueCommentsUseCase } from "@/application/interfaces/use-cases/Issue/IGetIssueCommentsUseCase";
import { CommentResponseDto } from "@/application/dtos/CommentDto";
import { ICommentRepository } from "@/application/interfaces/repositories/ICommentRepository";

export class GetIssueCommentsUseCase implements IGetIssueCommentsUseCase {
  constructor(private readonly _commentRepository: ICommentRepository) {}

  async execute(issueId: string): Promise<CommentResponseDto[]> {
    const comments = await this._commentRepository.findByIssueId(issueId);

    return comments.map((comment) => ({
      commentId: comment.commentId,
      issueId: comment.issueId,
      authorId: comment.authorId,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      mentions: comment.mentions || [],
      attachments: comment.attachments || [],
    }));
  }
}
