import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { Sprint } from "@/domain/entities/Sprint";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { IGetSprintsByProjectUseCase } from "@/application/interfaces/use-cases/Sprint/IGetSprintsByProjectUseCase";

export class GetSprintsByProjectUseCase implements IGetSprintsByProjectUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepository: IMembershipRepository,
    private readonly _sprintRepository: ISprintRepository,
  ) {}

  async execute(userId: string, projectId: string): Promise<Sprint[]> {
    const project = await this._projectRepo.findById(projectId);

    if (!project) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const membership = await this._membershipRepository.findByUserAndWorkspace(
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

    return this._sprintRepository.findByProjectId(projectId);
  }
}
