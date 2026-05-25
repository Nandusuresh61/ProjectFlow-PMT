export interface IClearNotificationHistoryUseCase {
  execute(receiverId: string, workspaceId?: string): Promise<boolean>;
}
