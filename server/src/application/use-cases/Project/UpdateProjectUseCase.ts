import { UpdateProjectDto } from "@/application/dtos/ProjectDto";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IUpdateProjectUseCase } from "@/application/interfaces/use-cases/Project/IUpdateProjectUseCase";
import { Project } from "@/domain/entities/Project";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class UpdateProjectUseCase implements IUpdateProjectUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _membershipRepo: IMembershipRepository
  ) {}

  async execute(
    userId: string,
    projectId: string,
    data: UpdateProjectDto
  ): Promise<Project> {
    const project = await this._projectRepo.findById(projectId);

    if (!project) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.PROJECT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const workspace = await this._workspaceRepo.findById(project.workspaceId);

    if (!workspace) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.WORKSPACE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const membership = await this._membershipRepo.findByUserAndWorkspace(
      userId,
      project.workspaceId
    );

    if (workspace.ownerId !== userId && !membership) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN
      );
    }

    if (
      workspace.ownerId !== userId &&
      membership?.role !== WorkspaceRoleEnum.WORKSPACE_ADMIN
    ) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN
      );
    }

    const workspaceMembers = await this._membershipRepo.findByWorkspace(
      project.workspaceId
    );
    const allowedMemberIds = new Set(
      workspaceMembers.map((workspaceMember) => workspaceMember.userId)
    );
    allowedMemberIds.add(workspace.ownerId);

    const memberIds = data.memberIds
      ? Array.from(new Set(data.memberIds))
      : project.memberIds;

    const hasInvalidProjectMember = memberIds.some(
      (memberId) => !allowedMemberIds.has(memberId)
    );

    if (hasInvalidProjectMember) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        AppMessages.INVALID_PROJECT_MEMBERS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    if (typeof data.name === "string") {
      project.name = data.name.trim();
    }

    if (typeof data.projectKey === "string") {
      project.projectKey = data.projectKey.trim().toUpperCase();
    }

    if (data.description !== undefined) {
      project.description = data.description?.trim() || null;
    }

    project.memberIds = memberIds;
    project.updatedAt = new Date();

    return this._projectRepo.update(project);
  }
}
