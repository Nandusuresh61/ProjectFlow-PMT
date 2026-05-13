import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IUpdateSprintUseCase } from "@/application/interfaces/use-cases/Sprint/IUpdateSprintUseCase";
import { Sprint } from "@/domain/entities/Sprint";
import { UpdateSprintInput } from "@/shared/schema/sprint/UpdateSprintSchema";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class UpdateSprintUseCase implements IUpdateSprintUseCase {
  constructor(
    private readonly _sprintRepository: ISprintRepository,
    private readonly _membershipRepository: IMembershipRepository,
  ) {}

  async execute(userId: string, input: UpdateSprintInput): Promise<Sprint> {
    const { sprintId, workspaceId, ...data } = input;

    const sprint = await this._sprintRepository.findById(sprintId);
    if (!sprint) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.TARGET_SPRINT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    const membership = await this._membershipRepository.findByUserAndWorkspace(
      userId,
      workspaceId,
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

    const updatedSprint = await this._sprintRepository.update(sprintId, {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      updatedAt: new Date(),
    });

    if (!updatedSprint) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        AppMessages.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedSprint;
  }
}
