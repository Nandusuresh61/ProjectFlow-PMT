import { Workspace } from "@/domain/entities/Workspace";
import { WorkspaceQueryOptions, PaginatedWorkspacesResult, WorkspaceDetailsDto } from "@/application/dtos/WorkspaceDtos";

export interface IWorkspaceRepository {
  create(workspace: Workspace): Promise<Workspace>;
  findById(workspaceId: string): Promise<Workspace | null>;
  findAllWorkspaces(options: WorkspaceQueryOptions): Promise<PaginatedWorkspacesResult>;
  getWorkspaceDetails(workspaceId: string): Promise<WorkspaceDetailsDto | null>;
  updateWorkspaceStatus(workspaceId: string, isSuspended: boolean): Promise<void>;
}
