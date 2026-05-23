export type WorkspaceEventType =
  // Workspace Events
  | "WORKSPACE_CREATED"
  | "MEMBER_INVITED"
  | "MEMBER_JOINED"
  | "MEMBER_REMOVED"
  | "ROLE_CHANGED"
  // Project Events
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_ARCHIVED"
  // Sprint Events
  | "SPRINT_CREATED"
  | "SPRINT_STARTED"
  | "SPRINT_COMPLETED"
  | "SPRINT_CLOSED"
  // Issue Events
  | "ISSUE_CREATED"
  | "ISSUE_UPDATED"
  | "ISSUE_MOVED"
  | "ISSUE_STATUS_CHANGED"
  | "ISSUE_ASSIGNED"
  | "ISSUE_UNASSIGNED"
  | "ISSUE_PRIORITY_CHANGED"
  | "ISSUE_COMMENT_ADDED"
  | "ISSUE_ATTACHMENT_ADDED"
  | "ISSUE_WORKLOG_ADDED"
  // Board Events
  | "ISSUE_DRAGGED"
  | "COLUMN_REORDERED"
  // Ticket Events
  | "TICKET_CREATED"
  | "TICKET_REPLIED"
  | "TICKET_RESOLVED";

export type WorkspaceEventEntityType = "WORKSPACE" | "PROJECT" | "SPRINT" | "ISSUE" | "TICKET" | "USER" | "COMMENT" | "BOARD";

export type WorkspaceEventVisibility = "PUBLIC" | "PRIVATE" | "INTERNAL";

export class WorkspaceEvent {
  constructor(
    public readonly eventId: string,
    public readonly workspaceId: string,
    public readonly actorId: string,
    public readonly eventType: WorkspaceEventType,
    public readonly entityType: WorkspaceEventEntityType,
    public readonly entityId: string,
    public readonly metadata: Record<string, unknown>,
    public readonly visibility: WorkspaceEventVisibility = "PUBLIC",
    public readonly parentEntityType: WorkspaceEventEntityType | null = null,
    public readonly parentEntityId: string | null = null,
    public readonly projectId: string | null = null,
    public readonly createdAt: Date = new Date(),
    public actorName?: string
  ) {}
}
