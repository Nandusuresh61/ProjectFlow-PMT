import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { Workspace } from "@/domain/entities/workspace/Workspace";
import { WorkspaceModel } from "../database/models/MongoWorkspaceModel";

export class WorkspaceRepository implements IWorkspaceRepository {
  async create(workspace: Workspace): Promise<Workspace> {
    const created = await WorkspaceModel.create({
      workspaceId: workspace.workspaceId,
      name: workspace.name,
      ownerId: workspace.ownerId,
      planId: workspace.planId,
    });

    return new Workspace(
      created.workspaceId,
      created.name,
      created.ownerId,
      created.planId,
      created.createdAt,
      created.updatedAt,
    );
  }
}
