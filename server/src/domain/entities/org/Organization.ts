export class Organization {
  constructor(
    public organizationId: string | undefined,
    public name: string,
    public ownerId: string,
    public planId: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
