import { WorkspaceRoleEnum } from "shared";

export interface CreateInvitationDto {
  workspaceId: string;
  inviterId: string;
  email: string;
  role: WorkspaceRoleEnum;
}