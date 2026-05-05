export interface AddCommentDto {
  issueId: string;
  content: string;
}

export interface CommentResponseDto {
  commentId: string;
  issueId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
