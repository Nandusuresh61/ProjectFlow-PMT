import { IAddCommentUseCase } from "@/application/interfaces/use-cases/Issue/IAddCommentUseCase";
import { CommentResponseDto } from "@/application/dtos/CommentDto";
import { ICommentRepository } from "@/application/interfaces/repositories/ICommentRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { UidService } from "@/infrastructure/services/UidService";
import { Comment } from "@/domain/entities/Comment";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { AppMessages } from "@/shared/messages/AppMessages";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class AddCommentUseCase implements IAddCommentUseCase {
  constructor(
    private readonly _commentRepository: ICommentRepository,
    private readonly _issueRepository: IIssueRepository,
    private readonly _uidService: UidService
  ) {}

  async execute(userId: string, issueId: string, content: string): Promise<CommentResponseDto> {
    const issue = await this._issueRepository.findById(issueId);
    if (!issue) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.ISSUE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const commentId = this._uidService.createId();
    const now = new Date();

    const comment = new Comment(
      commentId,
      issueId,
      userId,
      content,
      now,
      now
    );

    const created = await this._commentRepository.create(comment);

    return {
      commentId: created.commentId,
      issueId: created.issueId,
      authorId: created.authorId,
      content: created.content,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }
}
