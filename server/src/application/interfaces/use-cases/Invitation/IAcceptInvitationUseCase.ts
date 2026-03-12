export interface IAcceptInvitationUseCase {
  execute(token: string, userId: string): Promise<{ workspaceId: string }>;
}
