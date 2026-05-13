import { CommentResponseDto } from "@/application/dtos/CommentDto";

export interface IGetIssueCommentsUseCase {
  execute(issueId: string): Promise<CommentResponseDto[]>;
}
