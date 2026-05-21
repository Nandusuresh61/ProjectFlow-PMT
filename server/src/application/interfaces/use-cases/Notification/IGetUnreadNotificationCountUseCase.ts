export interface IGetUnreadNotificationCountUseCase {
  execute(receiverId: string, workspaceId?: string): Promise<number>;
}
