export interface IMarkNotificationAsReadUseCase {
  execute(notificationId: string, receiverId: string): Promise<boolean>;
}
