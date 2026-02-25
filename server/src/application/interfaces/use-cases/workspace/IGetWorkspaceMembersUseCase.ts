export interface IGetWorkspaceMembersUseCase {
  execute(
    workspaceId: string,
  ): Promise<
    {
      userId: string;
      fullName: string;
      email: string;
      role: string;
      joinedAt: Date;
    }[]
  >;
}
