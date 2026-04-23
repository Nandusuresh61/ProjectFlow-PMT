import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { IGetActiveSprintUseCase, IGetActiveSprintUseCaseResponse } from "@/application/interfaces/use-cases/Sprint/IGetActiveSprintUseCase";

export class GetActiveSprintUseCase implements IGetActiveSprintUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepository: IMembershipRepository,
    private readonly _sprintRepository: ISprintRepository,
    private readonly _issueRepository: IIssueRepository,
  ) {}

  async execute(userId: string, projectId: string): Promise<IGetActiveSprintUseCaseResponse> {
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

    const activeSprint = await this._sprintRepository.findActiveProjectId(projectId);

    if (!activeSprint) {
      return {
        sprint: null,
        issues: [],
      };
    }

    const issues = await this._issueRepository.findBySprintId(activeSprint.sprintId);

    return {
      sprint: activeSprint,
      issues: issues,
    };
  }
}
