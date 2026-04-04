export interface ICheckWorkspaceNameUseCase {
  execute(name: string): Promise<boolean>;
}
