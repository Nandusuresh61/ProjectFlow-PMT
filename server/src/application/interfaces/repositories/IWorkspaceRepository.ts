import {
  PendingInvite,
  Workspace,
  WorkspaceMember,
} from "@/domain/entities/workspace/Workspace";

export interface IWorkspaceRepository {
  createWorkspace(
    data: Omit<Workspace, "workspaceId" | "createdAt" | "updatedAt"> & {
      workspaceId: string;
    },
  ): Promise<Workspace>;

  addMember(
    data: Omit<WorkspaceMember, "workspaceMemberId"> & {
      workspaceMemberId: string;
    },
  ): Promise<WorkspaceMember>;

  createPendingInvite(
    data: Omit<PendingInvite, "pendingInviteId"> & { pendingInviteId: string },
  ): Promise<PendingInvite>;

  findByOwnerId(ownerId: string): Promise<Workspace | null>;
}
