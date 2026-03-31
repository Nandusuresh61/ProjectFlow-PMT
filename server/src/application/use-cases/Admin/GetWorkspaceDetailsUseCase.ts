import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { WorkspaceDetailsDto } from "@/application/dtos/WorkspaceDtos";

export interface IGetWorkspaceDetailsUseCase {
  execute(workspaceId: string): Promise<WorkspaceDetailsDto | null>;
}

export class GetWorkspaceDetailsUseCase implements IGetWorkspaceDetailsUseCase {
  constructor(private readonly _workspaceRepository: IWorkspaceRepository) {}

  async execute(workspaceId: string): Promise<WorkspaceDetailsDto | null> {
    return this._workspaceRepository.getWorkspaceDetails(workspaceId);
  }
}
