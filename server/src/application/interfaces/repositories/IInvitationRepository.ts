import { Invitation } from "@/domain/entities/Invitation";
import { InvitationStatus } from "shared";

export interface IInvitationRepository {
  create(invitation: Invitation): Promise<Invitation>;

  findPendingByEmailAndWorkspace(
    email: string,
    workspaceId: string
  ): Promise<Invitation | null>;

  findByTokenHash(tokenHash: string): Promise<Invitation | null>;

  updateStatus(
    invitationId: string,
    status: InvitationStatus
  ): Promise<void>;
}