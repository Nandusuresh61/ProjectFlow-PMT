import { WorkspaceRoleEnum } from "shared";

export class Membership {
  constructor(
    public membershipId: string | undefined,
    public userId: string,
    public workspaceId: string,
    public role: WorkspaceRoleEnum,
    public joinedAt: Date
  ) { }
}

