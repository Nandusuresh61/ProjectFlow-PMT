import { ProjectVelocityDto } from "@/application/dtos/SprintAnalyticsDto";
import { ISprintAnalyticsRepository } from "@/application/interfaces/repositories/ISprintAnalyticsRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IGetProjectVelocityUseCase } from "@/application/interfaces/use-cases/Analytics/IGetProjectVelocityUseCase";
import { SprintAnalyticsMapper } from "@/application/mappers/SprintAnalyticsMapper";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";

export class GetProjectVelocityUseCase implements IGetProjectVelocityUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _sprintAnalyticsRepo: ISprintAnalyticsRepository,
  ) {}

  async execute(userId: string, projectId: string): Promise<ProjectVelocityDto> {
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

    const recentAnalytics = await this._sprintAnalyticsRepo.findRecentByProjectId(projectId, 12);
    const averageVelocity = await this._sprintAnalyticsRepo.getAverageVelocity(projectId, 12);

    return SprintAnalyticsMapper.toProjectVelocityDTO(
      projectId,
      recentAnalytics.reverse(),
      averageVelocity,
    );
  }
}
