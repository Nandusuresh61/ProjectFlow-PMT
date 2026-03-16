export class User {
  constructor(
    public userId: string,
    public fullName: string,
    public email: string,
    public passwordHash: string | undefined,
    public authProvider: string,
    public providerId: string | undefined,
    public currentWorkspaceId: string | undefined,
    public isSuperAdmin: boolean,
    public profileImage: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
