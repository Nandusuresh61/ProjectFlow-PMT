import type { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export interface InviteMember {
    email: string,
    role: WorkspaceRoleEnum
}

export interface InvitationPayload {
    invites: InviteMember[]
}