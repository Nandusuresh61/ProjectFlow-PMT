import type { WorkspaceEvent } from "@/types/activity";

export const formatActivityMessage = (event: WorkspaceEvent, actorName: string = "User"): React.ReactNode => {
  const { eventType, metadata } = event;

  switch (eventType) {
    case "ISSUE_CREATED":
      return `${actorName} created issue ${metadata?.issueKey} - ${metadata?.title}`;
    
    case "ISSUE_STATUS_CHANGED":
      return `${actorName} moved ${metadata?.issueKey} from ${metadata?.fromStatus} → ${metadata?.toStatus}`;
    
    case "ISSUE_MOVED":
      return `${actorName} moved ${metadata?.issueKey} to sprint ${metadata?.toSprintId || 'Backlog'}`;
    
    case "ISSUE_ASSIGNED":
      return `${actorName} assigned ${metadata?.issueKey} to ${metadata?.assigneeId}`; // Might need to fetch actual user names
      
    case "ISSUE_UNASSIGNED":
      return `${actorName} unassigned ${metadata?.issueKey}`;

    case "ISSUE_COMMENT_ADDED":
      return `${actorName} added a comment to ${metadata?.issueKey}`;

    case "SPRINT_STARTED":
      return `${actorName} started ${metadata?.sprintName || 'sprint'}`;
      
    case "SPRINT_COMPLETED":
      return `${actorName} completed ${metadata?.sprintName || 'sprint'}`;
      
    case "MEMBER_INVITED":
      return `${actorName} invited ${metadata?.email} as ${metadata?.role}`;

    case "MEMBER_JOINED":
      return `${actorName} joined the workspace as ${metadata?.role}`;

    case "PROJECT_CREATED":
      return `${actorName} created project ${metadata?.projectName}`;

    case "PROJECT_UPDATED":
      return `${actorName} updated project ${metadata?.projectName}`;

    case "SPRINT_CREATED":
      return `${actorName} created sprint ${metadata?.sprintName}`;

    default:
      return `${actorName} performed ${eventType}`;
  }
};
