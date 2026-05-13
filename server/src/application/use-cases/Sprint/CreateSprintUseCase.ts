import { CreateSprintDto } from "@/application/dtos/SprintDto";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ICreateSprintUseCase } from "@/application/interfaces/use-cases/Sprint/ICreateSprintUseCase";
import { Sprint } from "@/domain/entities/Sprint";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class CreateSprintUseCase implements ICreateSprintUseCase {
  constructor(
    private readonly _projectRepo: IProjectRepository,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _sprintRepository: ISprintRepository,
    private readonly _membershipRepository: IMembershipRepository,
  ) { }
  async execute(userId: string, data: CreateSprintDto): Promise<Sprint> {
    const { projectId, name, goal } = data;

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

    if (
      !membership ||
      (membership.role !== WorkspaceRoleEnum.WORKSPACE_OWNER &&
        membership.role !== WorkspaceRoleEnum.WORKSPACE_ADMIN)
    ) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN,
      );
    }

    const now = new Date();

    const sprintId = this._uidGenerator.createId();

    const sprint = new Sprint(
      sprintId,
      project.projectId,
      name,
      "PLANNED",
      [],
      undefined,
      undefined,
      goal || undefined,
      now,
      now,
    );

    await this._sprintRepository.create(sprint);

    return sprint;
  }
}
