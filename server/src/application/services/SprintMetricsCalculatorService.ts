import {
  ISprintMetricsCalculatorService,
  SprintMetricsSnapshot,
} from "@/application/interfaces/services/ISprintMetricsCalculatorService";
import { Issue } from "@/domain/entities/Issue";
import { Sprint } from "@/domain/entities/Sprint";

export class SprintMetricsCalculatorService implements ISprintMetricsCalculatorService {
  calculateVelocity(completedStoryPoints: number): number {
    return completedStoryPoints;
  }

  calculateCompletionRate(completedStoryPoints: number, committedStoryPoints: number): number {
    if (committedStoryPoints <= 0) return 0;
    return this.round((completedStoryPoints / committedStoryPoints) * 100);
  }

  calculateSpillover(committedStoryPoints: number, completedStoryPoints: number): number {
    return Math.max(0, committedStoryPoints - completedStoryPoints);
  }

  aggregateSprintMetrics(
    sprint: Sprint,
    issues: Issue[],
    loggedHoursByIssueId: Record<string, number>,
    completedAt: Date,
  ): SprintMetricsSnapshot {
    const storyPointIssues = issues.filter((issue) => this.hasStoryPoints(issue));
    const completedStoryPointIssues = storyPointIssues.filter((issue) => issue.status === "DONE");

    const committedStoryPoints = this.sum(storyPointIssues.map((issue) => issue.storyPoints || 0));
    const completedStoryPoints = this.sum(completedStoryPointIssues.map((issue) => issue.storyPoints || 0));

    return {
      sprintId: sprint.sprintId,
      projectId: sprint.projectId,
      sprintName: sprint.name,
      sprintGoal: sprint.goal || null,
      startedAt: sprint.startDate || sprint.createdAt,
      completedAt,
      committedIssues: storyPointIssues.length,
      completedIssues: completedStoryPointIssues.length,
      incompleteIssues: storyPointIssues.length - completedStoryPointIssues.length,
      committedStoryPoints,
      completedStoryPoints,
      spilloverStoryPoints: this.calculateSpillover(committedStoryPoints, completedStoryPoints),
      committedEstimatedHours: this.round(this.sum(issues.map((issue) => issue.estimatedHours || 0))),
      loggedHours: this.round(this.sum(issues.map((issue) => loggedHoursByIssueId[issue.issueId] || 0))),
      remainingHours: this.round(this.sum(issues.map((issue) => issue.remainingHours || 0))),
      completionRate: this.calculateCompletionRate(completedStoryPoints, committedStoryPoints),
      velocity: this.calculateVelocity(completedStoryPoints),
      scopeChangeCount: 0,
    };
  }

  private hasStoryPoints(issue: Issue): boolean {
    return issue.type === "STORY" || issue.type === "BUG";
  }

  private sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
