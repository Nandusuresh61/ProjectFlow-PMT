import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IGetWorkspaceProjectsUseCase } from "@/application/interfaces/use-cases/Project/IGetWorkspaceProjectsUseCase";
import { Project } from "@/domain/entities/Project";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class GetWorkspaceProjectsUseCase
  implements IGetWorkspaceProjectsUseCase
{
  constructor(
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _projectRepo: IProjectRepository
  ) {}

  async execute(userId: string, workspaceId: string): Promise<Project[]> {
    const workspace = await this._workspaceRepo.findById(workspaceId);

    if (!workspace) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.WORKSPACE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (workspace.ownerId === userId) {
      return this._projectRepo.findByWorkspaceId(workspaceId);
    }

    const membership = await this._membershipRepo.findByUserAndWorkspace(
      userId,
      workspaceId
    );

    if (!membership) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN
      );
    }

    if (membership.role === WorkspaceRoleEnum.WORKSPACE_ADMIN) {
      return this._projectRepo.findByWorkspaceId(workspaceId);
    }

    return this._projectRepo.findByWorkspaceIdAndMemberId(workspaceId, userId);
  }
}
