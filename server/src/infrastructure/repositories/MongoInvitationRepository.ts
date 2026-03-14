import { IInvitationRepository } from "@/application/interfaces/repositories/IInvitationRepository";
import { Invitation } from "@/domain/entities/Invitation";
import { InvitationModel, InvitationDocument } from "../database/models/MongoInvitationModel";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { InvitationStatus } from "shared";

export class MongoInvitationRepository
  extends MongoBaseRepository<Invitation, InvitationDocument>
  implements IInvitationRepository
{
  constructor() {
    super(InvitationModel);
  }

  protected mapToEntity(doc: InvitationDocument): Invitation {
    return new Invitation(
      doc.invitationId,
      doc.email,
      doc.workspaceId,
      doc.role,
      doc.tokenHash,
      doc.status, 
      doc.expiresAt,
      doc.createdAt
    );
  }

  async create(invitation: Invitation): Promise<Invitation> {
    const invitationDoc = {
      invitationId: invitation.invitationId,
      email: invitation.email,
      workspaceId: invitation.workspaceId,
      role: invitation.role,
      tokenHash: invitation.tokenHash,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
    };

    return super.create(invitationDoc);
  }

  async findPendingByEmailAndWorkspace(
    email: string,
    workspaceId: string
  ): Promise<Invitation | null> {
    return this.findOne({
      email,
      workspaceId,
      status: InvitationStatus.PENDING,
    });
  }

  async findByTokenHash(tokenHash: string): Promise<Invitation | null> {
    return this.findOne({ tokenHash });
  }

  async updateStatus(
    invitationId: string,
    status: InvitationStatus
  ): Promise<void> {
    await this.updateOne(
      { invitationId },
      { status }
    );
  }
}