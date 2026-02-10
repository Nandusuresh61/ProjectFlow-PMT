import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import {
  PendingInvite,
  Workspace,
  WorkspaceMember,
} from "@/domain/entities/workspace/Workspace";
import { WorkspaceModel } from "../database/models/MongoWorkspaceModel";
import { WorkspaceMemberModel } from "../database/models/MongoWorkspaceMemberModel";
import { PendingInviteModel } from "../database/models/MongoPendingInviteMember";

export class MongoWorkspaceRepostitory implements IWorkspaceRepository {
  async createWorkspace(
    data: Omit<Workspace, "workspaceId" | "createdAt" | "updatedAt"> & {
      workspaceId: string;
    },
  ): Promise<Workspace> {
    const workspace = new WorkspaceModel(data);
    return await workspace.save();
  }
  async addMember(
    data: Omit<WorkspaceMember, "workspaceMemberId"> & {
      workspaceMemberId: string;
    },
  ): Promise<WorkspaceMember> {
    const member = new WorkspaceMemberModel(data);
    return await member.save();
  }
  async createPendingInvite(
    data: Omit<PendingInvite, "pendingInviteId"> & { pendingInviteId: string },
  ): Promise<PendingInvite> {
    const invite = new PendingInviteModel(data);
    return await invite.save();
  }
  async findByOwnerId(ownerId: string): Promise<Workspace | null> {
    return WorkspaceModel.findOne({ ownerId });
  }
}
