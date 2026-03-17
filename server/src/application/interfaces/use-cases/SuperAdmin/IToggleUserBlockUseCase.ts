export interface IToggleUserBlockUseCase {
  execute(userId: string): Promise<boolean>;
}
