export enum NotificationType {
  WORKSPACE_INVITE = "WORKSPACE_INVITE",
  ISSUE_ASSIGNED = "ISSUE_ASSIGNED",
  ISSUE_COMMENT = "ISSUE_COMMENT",
  SPRINT_STARTED = "SPRINT_STARTED",
  TICKET_REPLY = "TICKET_REPLY",
  MENTION = "MENTION",
}

export class Notification {
  constructor(
    public readonly notificationId: string,
    public readonly receiverId: string,
    public readonly workspaceId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    public readonly isRead: boolean,
    public readonly createdAt: Date,
    public readonly projectId?: string,
  ) {}
}
