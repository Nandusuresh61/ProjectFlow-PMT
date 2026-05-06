import { SprintAnalyticsDto } from "@/application/dtos/SprintAnalyticsDto";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { ISprintAnalyticsRepository } from "@/application/interfaces/repositories/ISprintAnalyticsRepository";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { ISprintMetricsCalculatorService } from "@/application/interfaces/services/ISprintMetricsCalculatorService";
import { IGetSprintAnalyticsUseCase } from "@/application/interfaces/use-cases/Analytics/IGetSprintAnalyticsUseCase";
import { SprintAnalyticsMapper } from "@/application/mappers/SprintAnalyticsMapper";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";

export class GetSprintAnalyticsUseCase implements IGetSprintAnalyticsUseCase {
  constructor(
    private readonly _sprintAnalyticsRepo: ISprintAnalyticsRepository,
    private readonly _sprintRepo: ISprintRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _workLogRepo: IWorkLogRepository,
    private readonly _metricsCalculator: ISprintMetricsCalculatorService,
  ) {}

  async execute(userId: string, sprintId: string): Promise<SprintAnalyticsDto> {
    const snapshot = await this._sprintAnalyticsRepo.findBySprintId(sprintId);

    if (snapshot) {
      await this.ensureProjectAccess(userId, snapshot.projectId);
      return SprintAnalyticsMapper.toDTO(snapshot);
    }

    const sprint = await this._sprintRepo.findById(sprintId);

    if (!sprint) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.TARGET_SPRINT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const project = await this.ensureProjectAccess(userId, sprint.projectId);
    const issues = await this._issueRepo.findBySprintId(sprintId);
    const loggedHoursByIssueId = await this._workLogRepo.getTotalLoggedHoursByIssueIds(
      issues.map((issue) => issue.issueId),
    );

    const metrics = this._metricsCalculator.aggregateSprintMetrics(
      sprint,
      issues,
      loggedHoursByIssueId,
      new Date(),
    );

    return SprintAnalyticsMapper.toLiveDTO(metrics, project.workspaceId);
  }

  private async ensureProjectAccess(userId: string, projectId: string) {
    const project = await this._projectRepo.findById(projectId);

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

    if (!membership) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN,
      );
    }

    return project;
  }
}
