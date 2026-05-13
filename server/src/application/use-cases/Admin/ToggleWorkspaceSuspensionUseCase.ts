import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";

export interface IToggleWorkspaceSuspensionUseCase {
  execute(workspaceId: string): Promise<void>;
}

export class ToggleWorkspaceSuspensionUseCase implements IToggleWorkspaceSuspensionUseCase {
  constructor(private readonly _workspaceRepository: IWorkspaceRepository) {}

  async execute(workspaceId: string): Promise<void> {
    const workspace = await this._workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    await this._workspaceRepository.updateWorkspaceStatus(workspaceId, !workspace.isSuspended);
  }
}
