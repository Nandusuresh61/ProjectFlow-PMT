export class Comment {
  constructor(
    public readonly commentId: string,
    public readonly issueId: string,
    public readonly authorId: string,
    public content: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public mentions: string[] = [],
    public attachments: string[] = [],
  ) {}
}
