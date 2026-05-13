export interface IDeleteWorkLogUseCase {
  execute(userId: string, workLogId: string): Promise<void>;
}
