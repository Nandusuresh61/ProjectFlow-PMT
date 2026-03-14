import { IGetUserWorkspacesUseCase } from "@/application/interfaces/use-cases/workspace/IGetUserWorkspacesUseCase";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { Workspace } from "@/domain/entities/Workspace";
import { AppError, AppMessages, ErrorCode, HttpStatusCode } from "shared";

export class GetUserWorkspacesUseCase implements IGetUserWorkspacesUseCase {
  constructor(
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _workspaceRepo: IWorkspaceRepository
  ) {}

  async execute(userId: string): Promise<Workspace[]> {
    const memberships = await this._membershipRepo.findByUserId(userId);
    
    if (!memberships || memberships.length === 0) {
      return [];
    }

    const workspaces: Workspace[] = [];
    for (const membership of memberships) {
      const workspace = await this._workspaceRepo.findById(membership.workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  }
}
