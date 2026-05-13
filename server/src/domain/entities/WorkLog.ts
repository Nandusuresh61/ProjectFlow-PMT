export class WorkLog {
  constructor(
    public readonly workLogId: string,
    public readonly issueId: string,
    public readonly userId: string,
    public hours: number,
    public note: string | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
