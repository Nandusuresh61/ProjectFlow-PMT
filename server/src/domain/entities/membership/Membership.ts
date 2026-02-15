import { OrganizationRoleEnum } from "shared";

export class Membership {
  constructor(
    public membershipId: string | undefined,
    public userId: string,
    public organizationId: string,
    public role: OrganizationRoleEnum,
    public joinedAt: Date
  ) {}
}

