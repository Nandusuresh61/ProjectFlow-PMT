import { InvitationStatus, WorkspaceRoleEnum } from "shared";

export class Invitation {
  constructor(
    public invitationId: string,
    public email: string,
    public workspaceId: string,
    public role: WorkspaceRoleEnum,
    public tokenHash: string,
    public status: InvitationStatus,
    public expiresAt: Date,
    public createdAt: Date
  ) {}
}
