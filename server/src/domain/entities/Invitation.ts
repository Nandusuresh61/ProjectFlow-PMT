import { InvitationStatus } from "@/shared/enums/InvitationStatusEnum";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

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
