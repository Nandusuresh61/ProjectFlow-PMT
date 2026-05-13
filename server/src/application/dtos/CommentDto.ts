export interface AddCommentDto {
  issueId: string;
  content: string;
  mentions?: string[];
  attachments?: string[];
}

export interface CommentResponseDto {
  commentId: string;
  issueId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  mentions: string[];
  attachments: string[];
}
