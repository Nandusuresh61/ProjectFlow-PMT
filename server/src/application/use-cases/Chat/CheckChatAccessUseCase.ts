import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";

export class CheckChatAccessUseCase {
  constructor(
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _workspaceRepo: IWorkspaceRepository
  ) { }

  async execute(userId: string, roomId: string): Promise<boolean> {
    const workspace = await this._workspaceRepo.findById(roomId);
    if (workspace) {
      if (workspace.ownerId === userId) return true;
      const membership = await this._membershipRepo.findByUserAndWorkspace(userId, roomId);
      return !!membership;
    }

    const project = await this._projectRepo.findById(roomId);
    if (project) {
      if (project.memberIds.includes(userId)) return true;
      const projectWorkspace = await this._workspaceRepo.findById(project.workspaceId);
      return projectWorkspace?.ownerId === userId;
    }

    return false;
  }
}
