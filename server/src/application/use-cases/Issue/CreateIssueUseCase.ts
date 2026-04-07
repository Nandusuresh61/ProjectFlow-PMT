import { CreateIssueDto } from "@/application/dtos/IssueDto";
import { IIssueRepository } from "@/application/interfaces/repositories/IIssueRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { Issue } from "@/domain/entities/Issue";
import { sizeToPointsMap } from "@/shared/story/sizeToPointsMap";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { ICreateIssueUseCase } from "@/application/interfaces/use-cases/Issue/ICreateIssueUseCase";

export class CreateIssueUseCase implements ICreateIssueUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _issueRepo: IIssueRepository,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _membershipRepo: IMembershipRepository
  ) {}

  async execute(userId: string, data: CreateIssueDto): Promise<Issue> {
    const project = await this._projectRepo.findById(data.projectId);
    if (!project) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const workspace = await this._workspaceRepo.findById(data.workspaceId);
    if (!workspace) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.WORKSPACE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    if (workspace.ownerId !== userId) {
      const membership = await this._membershipRepo.findByUserAndWorkspace(
        userId,
        data.workspaceId
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

    const sequence = await this._projectRepo.incrementIssueSequence(
      data.projectId
    );

    const issueKey = `${project.projectKey}-${sequence}`;

    let storyPoints: number | null = null;

    if (data.sizeLabel) {
      storyPoints = sizeToPointsMap[data.sizeLabel];
    }

    const status = data.sprintId ? "TODO" : "BACKLOG";

    const issue = new Issue(
      this._uidGenerator.createId(),
      issueKey,
      data.title,
      data.description || "",
      data.type,
      status,
      data.priority,
      data.sizeLabel || null,
      storyPoints,
      data.assigneeId || null,
      data.sprintId || null,
      data.projectId,
      data.workspaceId,
      data.parentId || null,
      data.subtasks || [],
      new Date(),
      new Date()
    );

    return await this._issueRepo.create(issue);
  }
}
