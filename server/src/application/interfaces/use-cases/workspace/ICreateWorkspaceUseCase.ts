import { Workspace } from "@/domain/entities/Workspace";

export interface ICreateWorkspaceUseCase {
  execute(
    userId: string,
    workspaceName: string,
    planId?: string
  ): Promise<{ workspaceId: string }>;
}
