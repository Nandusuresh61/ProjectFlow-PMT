import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { Workspace } from "@/domain/entities/Workspace";
import { WorkspaceModel, WorkspaceDocument } from "../database/models/MongoWorkspaceModel";
import { MongoBaseRepository } from "./MongoBaseRepository";

export class WorkspaceRepository extends MongoBaseRepository<Workspace, WorkspaceDocument> implements IWorkspaceRepository {
  constructor() {
    super(WorkspaceModel);
  }

  protected mapToEntity(doc: WorkspaceDocument): Workspace {
    return new Workspace(
      doc.workspaceId,
      doc.name,
      doc.ownerId,
      doc.planId,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(workspace: Workspace): Promise<Workspace> {
    const workspaceDoc = {
      workspaceId: workspace.workspaceId,
      name: workspace.name,
      ownerId: workspace.ownerId,
      planId: workspace.planId,
    };
    return super.create(workspaceDoc);
  }

  async findById(workspaceId: string) {
  return this.findOne({ workspaceId });
}
}
