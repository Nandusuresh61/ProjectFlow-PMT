import { Workspace } from "@/domain/entities/Workspace";

export interface IWorkspaceRepository {
  create(workspace: Workspace): Promise<Workspace>;
  findById(workspaceId: string): Promise<Workspace | null>;
}
