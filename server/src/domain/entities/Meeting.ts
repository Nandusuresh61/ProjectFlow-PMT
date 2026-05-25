export type MeetingStatus = "PENDING" | "ACTIVE" | "ENDED";

export class Meeting {
  constructor(
    public meetingId: string,
    public workspaceId: string,
    public hostId: string,
    public title: string,
    public participants: string[],
    public status: MeetingStatus,
    public scheduledAt: Date,
    public duration: number,
    public startedAt: Date | null,
    public endedAt: Date | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
