import { SprintPerformanceSummaryDto } from "@/application/dtos/SprintAnalyticsDto";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { ISprintAnalyticsRepository } from "@/application/interfaces/repositories/ISprintAnalyticsRepository";
import { IGetSprintPerformanceSummaryUseCase } from "@/application/interfaces/use-cases/Analytics/IGetSprintPerformanceSummaryUseCase";
import { SprintAnalyticsMapper } from "@/application/mappers/SprintAnalyticsMapper";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";

export class GetSprintPerformanceSummaryUseCase implements IGetSprintPerformanceSummaryUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _sprintAnalyticsRepo: ISprintAnalyticsRepository,
  ) {}

  async execute(userId: string, projectId: string): Promise<SprintPerformanceSummaryDto> {
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

    const analytics = await this._sprintAnalyticsRepo.findByProjectId(projectId);
    const averageVelocity = await this._sprintAnalyticsRepo.getAverageVelocity(projectId);

    return SprintAnalyticsMapper.toPerformanceSummaryDTO(
      projectId,
      analytics,
      averageVelocity,
    );
  }
}
