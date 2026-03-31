import { CreateProjectDto } from "@/application/dtos/ProjectDto";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ICreateProjectUseCase } from "@/application/interfaces/use-cases/Project/ICreateProjectUseCase";
import { Project } from "@/domain/entities/Project";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class CreateProjectUseCase implements ICreateProjectUseCase {
  constructor(
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _uidGenerator: IUidGenerator
  ) {}

  async execute(userId: string, data: CreateProjectDto): Promise<Project> {
    const workspace = await this._workspaceRepo.findById(data.workspaceId);

    if (!workspace) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.WORKSPACE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const membership = await this._membershipRepo.findByUserAndWorkspace(
      userId,
      data.workspaceId
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

    const plan = await this._planRepo.findById(workspace.planId);

    if (!plan) {
      throw new AppError(
        ErrorCode.PLAN,
        AppMessages.PLAN_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const projectCount = await this._projectRepo.countByWorkspaceId(
      data.workspaceId
    );

    if (projectCount >= plan.maxProjects) {
      throw new AppError(
        ErrorCode.PLAN,
        AppMessages.PROJECT_LIMIT_EXCEEDED,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const existingName = await this._projectRepo.findByNameAndWorkspace(
      data.name.trim(),
      data.workspaceId
    );

    if (existingName) {
      throw new AppError(
        ErrorCode.ALREADY_EXISTS,
        AppMessages.PROJECT_NAME_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const existingKey = await this._projectRepo.findByKeyAndWorkspace(
      data.projectKey.trim(),
      data.workspaceId
    );

    if (existingKey) {
      throw new AppError(
        ErrorCode.ALREADY_EXISTS,
        AppMessages.PROJECT_KEY_ALREADY_EXISTS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const workspaceMembers = await this._membershipRepo.findByWorkspace(
      data.workspaceId
    );

    const allowedMemberIds = new Set(
      workspaceMembers.map((workspaceMember) => workspaceMember.userId)
    );
    allowedMemberIds.add(workspace.ownerId);

    const projectMemberIds = Array.from(new Set(data.memberIds ?? []));
    const hasInvalidProjectMember = projectMemberIds.some(
      (memberId) => !allowedMemberIds.has(memberId)
    );

    if (hasInvalidProjectMember) {
      throw new AppError(
        ErrorCode.INVALID_OPERATION,
        AppMessages.INVALID_PROJECT_MEMBERS,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const now = new Date();

    const project = new Project(
      this._uidGenerator.createId(),
      data.projectKey.trim().toUpperCase(),
      data.name.trim(),
      data.description?.trim() || null,
      data.workspaceId,
      userId,
      projectMemberIds,
      "ACTIVE",
      now,
      now
    );

    return this._projectRepo.create(project);
  }
}
