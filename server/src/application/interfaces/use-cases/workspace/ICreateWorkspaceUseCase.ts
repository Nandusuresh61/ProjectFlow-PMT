

export interface ICreateWorkspaceUseCase {
  execute(
    userId: string,
    workspaceName: string,
    planId?: string
  ): Promise<{ workspaceId: string }>;
}
