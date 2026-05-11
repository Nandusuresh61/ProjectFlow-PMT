import { Issue } from "@/domain/entities/Issue";
import { Sprint } from "@/domain/entities/Sprint";

export interface SprintMetricsSnapshot {
  sprintId: string;
  projectId: string;
  sprintName: string;
  sprintGoal: string | null;
  startedAt: Date;
  completedAt: Date;
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
}

export interface ISprintMetricsCalculatorService {
  calculateVelocity(completedStoryPoints: number): number;
  calculateCompletionRate(completedStoryPoints: number, committedStoryPoints: number): number;
  calculateSpillover(committedStoryPoints: number, completedStoryPoints: number): number;
  aggregateSprintMetrics(
    sprint: Sprint,
    issues: Issue[],
    loggedHoursByIssueId: Record<string, number>,
    completedAt: Date,
  ): SprintMetricsSnapshot;
}
