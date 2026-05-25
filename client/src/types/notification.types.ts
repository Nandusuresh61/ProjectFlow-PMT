export enum NotificationType {
  WORKSPACE_INVITE = 'WORKSPACE_INVITE',
  ISSUE_ASSIGNED = 'ISSUE_ASSIGNED',
  ISSUE_COMMENT = 'ISSUE_COMMENT',
  SPRINT_STARTED = 'SPRINT_STARTED',
  TICKET_REPLY = 'TICKET_REPLY',
}

export interface INotification {
  notificationId: string;
  receiverId: string;
  workspaceId: string;
  projectId?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
