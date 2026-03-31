export class Workspace {
  constructor(
    public workspaceId: string | undefined,
    public name: string,
    public ownerId: string,
    public planId: string,
    public createdAt: Date,
    public updatedAt: Date,
    public isSuspended: boolean = false,
    public planExpireDate: Date | null = null,
  ) { }
}
