import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export interface CreateInvitationDto {
  workspaceId: string;
  inviterId: string;
  email: string;
  role: WorkspaceRoleEnum;
}