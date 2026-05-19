import { IGetWorkspaceActivityFeedUseCase } from "@/application/interfaces/use-cases/Activity/IGetWorkspaceActivityFeedUseCase";
import { IWorkspaceEventRepository } from "@/application/interfaces/repositories/IWorkspaceEventRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { WorkspaceEvent } from "@/domain/entities/WorkspaceEvent";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { AppMessages } from "@/shared/messages/AppMessages";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export class GetWorkspaceActivityFeedUseCase implements IGetWorkspaceActivityFeedUseCase {
  constructor(
    private readonly _eventRepo: IWorkspaceEventRepository,
    private readonly _membershipRepo: IMembershipRepository
  ) {}

  async execute(
    userId: string,
    workspaceId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WorkspaceEvent[]> {
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

    // Based on requirements, only Owner and Admin can access the FULL workspace feed.
    if (
      membership.role !== WorkspaceRoleEnum.WORKSPACE_OWNER &&
      membership.role !== WorkspaceRoleEnum.WORKSPACE_ADMIN
    ) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.UNAUTHORIZED_ACCESS,
        HttpStatusCode.FORBIDDEN
      );
    }

    return await this._eventRepo.getWorkspaceFeed(workspaceId, options);
  }
}
