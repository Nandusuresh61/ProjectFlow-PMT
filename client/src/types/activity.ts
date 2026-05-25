export type WorkspaceEventType =
  | "WORKSPACE_CREATED"
  | "MEMBER_INVITED"
  | "MEMBER_JOINED"
  | "MEMBER_REMOVED"
  | "ROLE_CHANGED"
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_ARCHIVED"
  | "SPRINT_CREATED"
  | "SPRINT_STARTED"
  | "SPRINT_COMPLETED"
  | "SPRINT_CLOSED"
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
  | "ISSUE_DRAGGED"
  | "COLUMN_REORDERED"
  | "TICKET_CREATED"
  | "TICKET_REPLIED"
  | "TICKET_RESOLVED";

export type WorkspaceEventEntityType =
  | "WORKSPACE"
  | "PROJECT"
  | "SPRINT"
  | "ISSUE"
  | "TICKET"
  | "USER"
  | "COMMENT"
  | "BOARD";

export interface WorkspaceEvent {
  eventId: string;
  workspaceId: string;
  actorId: string;
  eventType: WorkspaceEventType;
  entityType: WorkspaceEventEntityType;
  entityId: string;
  metadata: Record<string, unknown>;
  visibility: "PUBLIC" | "PRIVATE" | "INTERNAL";
  parentEntityType: WorkspaceEventEntityType | null;
  parentEntityId: string | null;
  projectId: string | null;
  createdAt: string;
  actorName?: string;
}
