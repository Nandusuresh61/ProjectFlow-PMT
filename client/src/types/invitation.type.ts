import type { WorkspaceRoleEnum } from "shared";

export interface InviteMember {
    email: string,
    role: WorkspaceRoleEnum
}

export interface InvitationPayload {
    invites: InviteMember[]
}