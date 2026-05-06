export interface SprintHistoryIssue {
  issueId: string;
  issueKey: string;
  title: string;
  type: "STORY" | "TASK" | "BUG";
  status: string;
  priority: string;
  assigneeId: string | null;
  storyPoints: number | null;
  estimatedHours: number | null;
  remainingHours: number | null;
  parentId: string | null;
  continuedFromIssueId: string | null;
  continuedIssueId: string | null;
  taskIds: string[];
  sizeLabel: string | null;
}

export interface SprintHistoryAnalytics {
  velocity: number;
  completionRate: number;
  committedIssues: number;
  completedIssues: number;
  incompleteIssues: number;
  committedStoryPoints: number;
  completedStoryPoints: number;
  spilloverStoryPoints: number;
  committedEstimatedHours: number;
  loggedHours: number;
  remainingHours: number;
  scopeChangeCount: number;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface SprintHistoryBurndown {
  sprintId: string;
  startDate: Date | null;
  endDate: Date | null;
  idealLine: { date: Date; remainingHours: number }[];
  actualLine: { date: Date; remainingHours: number }[];
  metrics: {
    totalEstimatedHours: number;
    currentRemainingHours: number;
    loggedHours: number;
    completedTasks: number;
    incompleteTasks: number;
  };
}

export interface SprintHistoryAllocationMember {
  userId: string;
  fullName: string;
  profileImage: string | null;
  assignedHours: number;
  loggedHours: number;
  remainingHours: number;
  completedTasks: number;
  incompleteTasks: number;
  capacityStatus: string;
}

export interface SprintHistoryAllocation {
  sprintId: string;
  members: SprintHistoryAllocationMember[];
  totals: {
    assignedHours: number;
    loggedHours: number;
    remainingHours: number;
  };
}

export interface SprintHistoryDetailsResponse {
  sprint: {
    sprintId: string;
    name: string;
    goal: string | null;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    plannedPoints: number;
    completedPoints: number;
  };
  analytics: SprintHistoryAnalytics | null;
  burndown: SprintHistoryBurndown | null;
  allocation: SprintHistoryAllocation | null;
  issues: SprintHistoryIssue[];
  spilloverIssues: SprintHistoryIssue[];
}

export interface IGetSprintHistoryDetailsUseCase {
  execute(sprintId: string): Promise<SprintHistoryDetailsResponse>;
}
