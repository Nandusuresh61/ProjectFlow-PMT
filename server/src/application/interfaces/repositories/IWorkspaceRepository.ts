import { Workspace } from "@/domain/entities/workspace/Workspace";

export interface IWorkspaceRepository {
  create(workspace: Workspace): Promise<Workspace>;
}
