import { CommentResponseDto } from "@/application/dtos/CommentDto";

export interface IAddCommentUseCase {
  execute(userId: string, issueId: string, content: string, mentions?: string[], attachments?: string[]): Promise<CommentResponseDto>;
}
