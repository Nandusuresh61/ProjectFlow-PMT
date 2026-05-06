import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { ISprintAnalyticsRepository } from "@/application/interfaces/repositories/ISprintAnalyticsRepository";
import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ISprintMetricsCalculatorService } from "@/application/interfaces/services/ISprintMetricsCalculatorService";
import { ICompleteSprintUseCase } from "@/application/interfaces/use-cases/Sprint/ICompleteSprintUseCase";
import { Sprint } from "@/domain/entities/Sprint";
import { SprintAnalytics } from "@/domain/entities/SprintAnalytics";
import { CompleteSprintDto } from "@/application/dtos/SprintDto";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class CompleteSprintUseCase implements ICompleteSprintUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _sprintAnalyticsRepo: ISprintAnalyticsRepository,
    private readonly _workLogRepo: IWorkLogRepository,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _metricsCalculator: ISprintMetricsCalculatorService,
  ) { }

  async execute(userId: string, data: CompleteSprintDto): Promise<Sprint> {
    const { sprintId, moveToSprintId } = data;

    const sprint = await this._sprintRepo.findById(sprintId);

    if (!sprint) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.TARGET_SPRINT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const project = await this._projectRepo.findById(sprint.projectId);
    if (!project) {
       throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const membership = await this._membershipRepo.findByUserAndWorkspace(
      userId,
      project.workspaceId,
    );

    if (
      !membership ||
      (membership.role !== WorkspaceRoleEnum.WORKSPACE_OWNER &&
        membership.role !== WorkspaceRoleEnum.WORKSPACE_ADMIN)
    ) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN,
      );
    }

    if (sprint.status !== "ACTIVE") {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.SPRINT_NOT_ACTIVE,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (moveToSprintId) {
      const targetSprint = await this._sprintRepo.findById(moveToSprintId);
      if (!targetSprint) {
        throw new AppError(
          ErrorCode.RESOURCE_NOT_FOUND,
          AppMessages.TARGET_SPRINT_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        );
      }

      if (targetSprint.projectId !== sprint.projectId) {
        throw new AppError(
          ErrorCode.INVALID_OPERATION,
          AppMessages.SPRINT_NOT_BELONG_TO_PROJECT,
          HttpStatusCode.BAD_REQUEST,
        );
      }
    }

    const issues = await this._issueRepo.findBySprintId(sprintId);
    const issueIds = issues.map((issue) => issue.issueId);
    const loggedHoursByIssueId = await this._workLogRepo.getTotalLoggedHoursByIssueIds(issueIds);
    const completedAt = new Date();
    const metrics = this._metricsCalculator.aggregateSprintMetrics(
      sprint,
      issues,
      loggedHoursByIssueId,
      completedAt,
    );

    const existingAnalytics = await this._sprintAnalyticsRepo.findBySprintId(sprintId);

    if (!existingAnalytics) {
      await this._sprintAnalyticsRepo.create(
        new SprintAnalytics(
          this._uidGenerator.createId(),
          sprint.sprintId,
          sprint.projectId,
          project.workspaceId,
          metrics.sprintName,
          metrics.sprintGoal,
          metrics.startedAt,
          metrics.completedAt,
          metrics.committedIssues,
          metrics.completedIssues,
          metrics.incompleteIssues,
          metrics.committedStoryPoints,
          metrics.completedStoryPoints,
          metrics.spilloverStoryPoints,
          metrics.committedEstimatedHours,
          metrics.loggedHours,
          metrics.remainingHours,
          metrics.completionRate,
          metrics.velocity,
          metrics.scopeChangeCount,
          completedAt,
        ),
      );
    }

    const incompleteIssues = issues.filter(issue => issue.status !== "DONE");

    const issuesToMove = [];
    const issuesToStay = issues.filter(issue => issue.status === "DONE");

    for (const issue of incompleteIssues) {
      if (issue.type === "STORY" || issue.type === "BUG") {
        const childTasks = issues.filter(i => i.parentId === issue.issueId);
        if (childTasks.length === 0) {
          issuesToMove.push(issue);
        } else {
          issuesToStay.push(issue);
        }
      } else {
        issuesToMove.push(issue);
      }
    }

    for (const issue of issuesToMove) {
      let newStatus = moveToSprintId ? "TODO" : "BACKLOG";
      if (issue.type === "STORY" || issue.type === "BUG") {
        newStatus = moveToSprintId ? "TODO" : "BACKLOG";
      }
      await this._issueRepo.update(issue.issueId, {
        sprintId: moveToSprintId || null,
        status: newStatus as any,
      });
    }

    if (moveToSprintId) {
      const targetSprint = await this._sprintRepo.findById(moveToSprintId);
      if (targetSprint) {
        const newIssueIds = Array.from(new Set([
          ...targetSprint.issueIds,
          ...issuesToMove.map(i => i.issueId),
        ]));
        await this._sprintRepo.update(moveToSprintId, { issueIds: newIssueIds });
      }
    }

    // Update old sprint
    const remainingIssueIds = issuesToStay.map(i => i.issueId);

    const updatedSprint = await this._sprintRepo.update(sprintId, {
      status: "COMPLETED",
      plannedPoints: metrics.committedStoryPoints,
      completedPoints: metrics.completedStoryPoints,
      issueIds: remainingIssueIds,
    });

    if (!updatedSprint) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        AppMessages.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedSprint;
  }
}
