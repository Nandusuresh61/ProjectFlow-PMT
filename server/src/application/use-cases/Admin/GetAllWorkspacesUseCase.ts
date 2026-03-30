import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { WorkspaceQueryOptions, PaginatedWorkspacesResult } from "@/application/dtos/WorkspaceDtos";

export interface IGetAllWorkspacesUseCase {
  execute(options: WorkspaceQueryOptions): Promise<PaginatedWorkspacesResult>;
}

export class GetAllWorkspacesUseCase implements IGetAllWorkspacesUseCase {
  constructor(private readonly _workspaceRepository: IWorkspaceRepository) {}

  async execute(options: WorkspaceQueryOptions): Promise<PaginatedWorkspacesResult> {
    return this._workspaceRepository.findAllWorkspaces(options);
  }
}
