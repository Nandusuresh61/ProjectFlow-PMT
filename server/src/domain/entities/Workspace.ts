export class Workspace {
  constructor(
    public workspaceId: string | undefined,
    public name: string,
    public ownerId: string,
    public planId: string,
    public isSuspended: boolean = false,
    public planExpireDate: Date | null = null,
    public createdAt: Date,
    public updatedAt: Date
  ) { }
}
