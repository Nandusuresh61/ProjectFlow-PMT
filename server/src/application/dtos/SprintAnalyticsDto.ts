export interface SprintAnalyticsDto {
  analyticsId: string | null;
  sprintId: string;
  projectId: string;
  workspaceId: string;
  sprintName: string;
  sprintGoal: string | null;
  startedAt: Date;
  completedAt: Date | null;
  committedIssues: number;
  completedIssues: number;
  incompleteIssues: number;
  committedStoryPoints: number;
  completedStoryPoints: number;
  spilloverStoryPoints: number;
  committedEstimatedHours: number;
  loggedHours: number;
  remainingHours: number;
  completionRate: number;
  velocity: number;
  scopeChangeCount: number;
  createdAt: Date | null;
  isSnapshot: boolean;
}

export interface SprintVelocityItemDto {
  sprintId: string;
  sprintName: string;
  completedAt: Date;
  committedStoryPoints: number;
  completedStoryPoints: number;
  velocity: number;
}

export interface ProjectVelocityDto {
  projectId: string;
  averageVelocity: number;
  sprints: SprintVelocityItemDto[];
}

export interface SprintPerformanceSummaryDto {
  projectId: string;
  averageVelocity: number;
  totalSprints: number;
  sprints: SprintAnalyticsDto[];
}
