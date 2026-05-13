import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { ISprintAnalyticsRepository } from "@/application/interfaces/repositories/ISprintAnalyticsRepository";
import { ISprintDailyMetricRepository } from "@/application/interfaces/repositories/ISprintDailyMetricRepository";
import { ISprintMemberAllocationRepository } from "@/application/interfaces/repositories/ISprintMemberAllocationRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { BurndownIdealLineCalculator } from "@/application/utils/BurndownIdealLineCalculator";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import {
  IGetSprintHistoryDetailsUseCase,
  SprintHistoryDetailsResponse,
  SprintHistoryIssue,
} from "@/application/interfaces/use-cases/Sprint/IGetSprintHistoryDetailsUseCase";

export class GetSprintHistoryDetailsUseCase implements IGetSprintHistoryDetailsUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _analyticsRepo: ISprintAnalyticsRepository,
    private readonly _metricRepo: ISprintDailyMetricRepository,
    private readonly _allocationRepo: ISprintMemberAllocationRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _userRepo: IUserRepository,
  ) { }

  async execute(sprintId: string): Promise<SprintHistoryDetailsResponse> {
    const sprint = await this._sprintRepo.findById(sprintId);

    if (!sprint) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.SPRINT_HISTORY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (sprint.status !== "COMPLETED") {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.SPRINT_HISTORY_ONLY_COMPLETED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    // Fetch all immutable snapshots in parallel
    const [analytics, dailyMetrics, allocations, sprintIssues] = await Promise.all([
      this._analyticsRepo.findBySprintId(sprintId),
      this._metricRepo.findBySprintId(sprintId),
      this._allocationRepo.findBySprintId(sprintId),
      this._issueRepo.findBySprintId(sprintId),
    ]);

    // ── Sprint overview ──────────────────────────────────────────────────────
    const sprintOverview = {
      sprintId: sprint.sprintId,
      name: sprint.name,
      goal: sprint.goal ?? null,
      status: sprint.status,
      startDate: sprint.startDate ?? null,
      endDate: sprint.endDate ?? null,
      plannedPoints: sprint.plannedPoints ?? 0,
      completedPoints: sprint.completedPoints ?? 0,
    };

    // ── Analytics (immutable SprintAnalytics snapshot) ──────────────────────
    const analyticsData = analytics
      ? {
        velocity: analytics.velocity,
        completionRate: analytics.completionRate,
        committedIssues: analytics.committedIssues,
        completedIssues: analytics.completedIssues,
        incompleteIssues: analytics.incompleteIssues,
        committedStoryPoints: analytics.committedStoryPoints,
        completedStoryPoints: analytics.completedStoryPoints,
        spilloverStoryPoints: analytics.spilloverStoryPoints,
        committedEstimatedHours: analytics.committedEstimatedHours,
        loggedHours: analytics.loggedHours,
        remainingHours: analytics.remainingHours,
        scopeChangeCount: analytics.scopeChangeCount,
        startedAt: analytics.startedAt,
        completedAt: analytics.completedAt,
      }
      : null;

    // ── Burndown (from immutable SprintDailyMetric snapshots) ───────────────
    let burndownData: SprintHistoryDetailsResponse["burndown"] = null;

    if (sprint.startDate && sprint.endDate && dailyMetrics.length > 0) {
      const latestMetric = dailyMetrics[dailyMetrics.length - 1];
      const maxEstimated = Math.max(...dailyMetrics.map((m) => m.totalEstimatedHours), 0);

      const idealLine = BurndownIdealLineCalculator.calculate(
        sprint.startDate,
        sprint.endDate,
        maxEstimated,
      );

      const actualLine = dailyMetrics.map((m) => ({
        date: m.date,
        remainingHours: m.totalRemainingHours,
      }));

      burndownData = {
        sprintId,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        idealLine,
        actualLine,
        metrics: {
          totalEstimatedHours: latestMetric.totalEstimatedHours,
          currentRemainingHours: latestMetric.totalRemainingHours,
          loggedHours: latestMetric.totalLoggedHours,
          completedTasks: latestMetric.completedTasks,
          incompleteTasks: latestMetric.incompleteTasks,
        },
      };
    }

    let allocationData: SprintHistoryDetailsResponse["allocation"] = null;

    if (allocations.length > 0) {
      const memberDetails = await Promise.all(
        allocations.map(async (allocation) => {
          const user = await this._userRepo.findById(allocation.userId);
          return {
            userId: allocation.userId,
            fullName: user ? user.fullName : "Unknown User",
            profileImage: user?.profileImage ?? null,
            assignedHours: allocation.assignedHours,
            loggedHours: allocation.loggedHours,
            remainingHours: allocation.remainingHours,
            completedTasks: allocation.completedTasks,
            incompleteTasks: allocation.incompleteTasks,
            capacityStatus: allocation.capacityStatus,
          };
        }),
      );

      const totals = allocations.reduce(
        (acc, curr) => {
          acc.assignedHours += curr.assignedHours;
          acc.loggedHours += curr.loggedHours;
          acc.remainingHours += curr.remainingHours;
          return acc;
        },
        { assignedHours: 0, loggedHours: 0, remainingHours: 0 },
      );

      totals.assignedHours = Math.round(totals.assignedHours * 100) / 100;
      totals.loggedHours = Math.round(totals.loggedHours * 100) / 100;
      totals.remainingHours = Math.round(totals.remainingHours * 100) / 100;

      allocationData = { sprintId, members: memberDetails, totals };
    }

    const mapIssue = (issue: (typeof sprintIssues)[0]): SprintHistoryIssue => ({
      issueId: issue.issueId,
      issueKey: issue.issueKey,
      title: issue.title,
      type: issue.type,
      status: issue.status,
      priority: issue.priority,
      assigneeId: issue.assigneeId,
      storyPoints: issue.storyPoints,
      estimatedHours: issue.estimatedHours ?? null,
      remainingHours: issue.remainingHours ?? null,
      parentId: issue.parentId,
      continuedFromIssueId: issue.continuedFromIssueId ?? null,
      continuedIssueId: issue.continuedIssueId ?? null,
      taskIds: issue.taskIds ?? [],
      sizeLabel: issue.sizeLabel,
    });

    // Completed issues: DONE or partially completed (has a continuation)
    const completedIssues = sprintIssues
      .filter((i) => i.status === "DONE" || (i.continuedIssueId ?? null) !== null)
      .map(mapIssue);

    const spilloverIssues = sprintIssues
      .filter((i) => i.status !== "DONE" && (i.continuedIssueId ?? null) === null)
      .map(mapIssue);

    return {
      sprint: sprintOverview,
      analytics: analyticsData,
      burndown: burndownData,
      allocation: allocationData,
      issues: completedIssues,
      spilloverIssues,
    };
  }
}
