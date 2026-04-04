import { ICheckWorkspaceNameUseCase } from "@/application/interfaces/use-cases/workspace/ICheckWorkspaceNameUseCase";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";

export class CheckWorkspaceNameUseCase implements ICheckWorkspaceNameUseCase {
  constructor(private readonly _workspaceRepo: IWorkspaceRepository) {}

  async execute(workspaceName: string): Promise<boolean> {
    const existing = await this._workspaceRepo.findByName(workspaceName.trim());
    return !existing;
  }
}
