export interface IGetWorkspaceMembersUseCase {
  execute(
    workspaceId: string,
    search?: string,
  ): Promise<
    {
      userId: string;
      fullName: string;
      email: string;
      role: string;
      joinedAt: Date;
      profileImage?: string;
    }[]
  >;
}
