import { IUpdateIssueUseCase } from "@/application/interfaces/use-cases/Issue/IUpdateIssueUseCase";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { UpdateIssueDto } from "@/application/dtos/IssueDto";
import { Issue } from "@/domain/entities/Issue";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class UpdateIssueUseCase implements IUpdateIssueUseCase {
  constructor(
    private readonly _issueRepository: IIssueRepository,
    private readonly _projectRepository: IProjectRepository,
    private readonly _workspaceRepository: IWorkspaceRepository,
    private readonly _membershipRepository: IMembershipRepository
  ) {}

  async execute(
    userId: string,
    issueId: string,
    data: UpdateIssueDto
  ): Promise<Issue> {
    const issue = await this._issueRepository.findById(issueId);

    if (!issue) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.ISSUE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const project = await this._projectRepository.findById(issue.projectId);

    if (!project) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const workspace = await this._workspaceRepository.findById(issue.workspaceId);

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
        issue.workspaceId
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

      if (membership.role === WorkspaceRoleEnum.WORKSPACE_VIEWER) {
        throw new AppError(
          ErrorCode.AUTH,
          AppMessages.UNAUTHORIZED_ACCESS,
          HttpStatusCode.FORBIDDEN
        );
      }
    }

    const updatedIssue = await this._issueRepository.update(
      issueId,
      data as Partial<Issue>
    );

    if (!updatedIssue) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.ISSUE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    return updatedIssue;
  }
}
