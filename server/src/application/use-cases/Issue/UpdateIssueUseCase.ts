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
import { sizeToPointsMap } from "@/shared/story/sizeToPointsMap";

import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";

export class UpdateIssueUseCase implements IUpdateIssueUseCase {
  constructor(
    private readonly _issueRepository: IIssueRepository,
    private readonly _projectRepository: IProjectRepository,
    private readonly _workspaceRepository: IWorkspaceRepository,
    private readonly _membershipRepository: IMembershipRepository,
    private readonly _workLogRepository: IWorkLogRepository
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

    const issueType = data.type || issue.type;

    if (issueType === "TASK") {
      data.sizeLabel = null;
      data.storyPoints = null;
    } else if (data.sizeLabel !== undefined) {
      data.storyPoints = data.sizeLabel ? sizeToPointsMap[data.sizeLabel] : null;
    }

    if (data.status === "DONE") {
      data.remainingHours = 0;
    } else if (data.estimatedHours !== undefined) {
      const totalLogged = await this._workLogRepository.getTotalLoggedHours(issueId);
      data.remainingHours = Math.max(0, data.estimatedHours - totalLogged);
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

    if (updatedIssue.type === "TASK" && updatedIssue.parentId) {
      const parentStory = await this._issueRepository.findById(updatedIssue.parentId);
      if (parentStory && parentStory.type === "STORY") {
        const { issues: siblings } = await this._issueRepository.findByProjectId(
          updatedIssue.projectId,
          1,
          1000,
          undefined,
          "TASK",
          updatedIssue.parentId
        );

        if (siblings.length > 0) {
          const allTodo = siblings.every(s => s.status === "TODO" || s.status === "BACKLOG");
          const allDone = siblings.every(s => s.status === "DONE");

          let newStatus = parentStory.status;
          if (allDone) {
            newStatus = "DONE";
          } else if (allTodo) {
            newStatus = "TODO";
          } else {
            newStatus = "IN_PROGRESS";
          }

          if (parentStory.status !== newStatus) {
            await this._issueRepository.update(parentStory.issueId, { status: newStatus });
          }
        }
      }
    }

    return updatedIssue;
  }
}
