import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { Workspace } from "@/domain/entities/Workspace";
import { WorkspaceModel, WorkspaceDocument } from "../database/models/MongoWorkspaceModel";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { WorkspaceQueryOptions, PaginatedWorkspacesResult, WorkspaceDetailsDto } from "@/application/dtos/WorkspaceDtos";

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
      doc.isSuspended,
      doc.planExpireDate,
    );
  }

  async create(workspace: Workspace): Promise<Workspace> {
    const workspaceDoc = {
      workspaceId: workspace.workspaceId,
      name: workspace.name,
      ownerId: workspace.ownerId,
      planId: workspace.planId,
      isSuspended: workspace.isSuspended,
      planExpireDate: workspace.planExpireDate,
    };
    return super.create(workspaceDoc);
  }

  async findById(workspaceId: string) {
    return this.findOne({ workspaceId });
  }

  async findByName(name: string): Promise<Workspace | null> {
    return this.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
  }

  async findByOwnerId(ownerId: string): Promise<Workspace | null> {
    return this.findOne({ ownerId });
  }

  async findAllWorkspaces(options: WorkspaceQueryOptions): Promise<PaginatedWorkspacesResult> {
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc" } = options;
    const skip = (page - 1) * limit;

    const matchStage: Record<string, any> = {};
    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    const sortStage: Record<string, 1 | -1> = {};
    sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;

    const result = await this.model.aggregate([
      { $match: matchStage },
      { $sort: sortStage },
      {
        $facet: {
          workspaces: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "users",
                localField: "ownerId",
                foreignField: "userId",
                as: "owner",
              },
            },
            { $unwind: "$owner" },
            {
              $lookup: {
                from: "plans",
                localField: "planId",
                foreignField: "planId",
                as: "plan",
              },
            },
            { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                workspaceId: 1,
                name: 1,
                ownerName: "$owner.fullName",
                ownerEmail: "$owner.email",
                planName: { $ifNull: ["$plan.type", "Free"] },
                isSuspended: 1,
                createdAt: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const workspaces = result[0].workspaces || [];
    const total = result[0].total[0]?.count || 0;

    return {
      workspaces,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getWorkspaceDetails(workspaceId: string): Promise<WorkspaceDetailsDto | null> {
    const result = await this.model.aggregate([
      { $match: { workspaceId } },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "userId",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $lookup: {
          from: "plans",
          localField: "planId",
          foreignField: "planId",
          as: "plan",
        },
      },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "projects",
          localField: "workspaceId",
          foreignField: "workspaceId",
          as: "projects",
        },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "workspaceId",
          foreignField: "workspaceId",
          as: "members",
        },
      },
      {
        $project: {
          workspaceId: 1,
          name: 1,
          ownerName: "$owner.fullName",
          ownerEmail: "$owner.email",
          planName: { $ifNull: ["$plan.type", "Free"] },
          planExpireDate: 1,
          projectCount: { $size: "$projects" },
          memberCount: { $size: "$members" },
          isSuspended: 1,
        },
      },
    ]);

    return result[0] || null;
  }

  async updateWorkspaceStatus(workspaceId: string, isSuspended: boolean): Promise<void> {
    await this.model.updateOne({ workspaceId }, { $set: { isSuspended } });
  }
}
