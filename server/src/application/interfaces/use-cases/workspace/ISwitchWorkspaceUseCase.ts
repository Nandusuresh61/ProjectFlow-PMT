export interface ISwitchWorkspaceUseCase {
  execute(userId: string, workspaceId: string): Promise<{ success: boolean; message: string }>;
}
