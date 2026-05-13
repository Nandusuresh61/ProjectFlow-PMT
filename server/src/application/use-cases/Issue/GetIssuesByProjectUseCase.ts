import { IGetIssuesByProjectUseCase } from "@/application/interfaces/use-cases/Issue/IGetIssuesByProjectUseCase";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { Issue } from "@/domain/entities/Issue";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class GetIssuesByProjectUseCase implements IGetIssuesByProjectUseCase {
  constructor(
    private readonly _issueRepository: IIssueRepository,
    private readonly _projectRepository: IProjectRepository,
    private readonly _workspaceRepository: IWorkspaceRepository,
    private readonly _membershipRepository: IMembershipRepository
  ) {}

  async execute(
    userId: string,
    projectId: string,
    page: number,
    limit: number,
    search?: string,
    type?: string,
    parentId?: string | null
  ): Promise<{ issues: Issue[]; total: number }> {
    const project = await this._projectRepository.findById(projectId);

    if (!project) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const workspace = await this._workspaceRepository.findById(project.workspaceId);

    if (!workspace) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.WORKSPACE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (workspace.ownerId !== userId) {
      const membership = await this._membershipRepository.findByUserAndWorkspace(
        userId,
        project.workspaceId
      );

      if (!membership) {
        throw new AppError(
          ErrorCode.AUTH,
          AppMessages.UNAUTHORIZED_ACCESS,
          HttpStatusCode.FORBIDDEN
        );
      }

      const isRestrictedRole =
        membership.role === WorkspaceRoleEnum.WORKSPACE_MEMBER ||
        membership.role === WorkspaceRoleEnum.WORKSPACE_VIEWER;

      if (isRestrictedRole && !project.memberIds.includes(userId)) {
        throw new AppError(
          ErrorCode.AUTH,
          AppMessages.UNAUTHORIZED_ACCESS,
          HttpStatusCode.FORBIDDEN
        );
      }
    }

    return await this._issueRepository.findByProjectId(
      projectId,
      page,
      limit,
      search,
      type,
      parentId
    );
  }
}
