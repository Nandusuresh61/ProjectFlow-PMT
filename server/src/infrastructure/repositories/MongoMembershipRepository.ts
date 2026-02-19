import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { Membership } from "@/domain/entities/membership/Membership";
import { MembershipModel, MembershipDocument } from "../database/models/MongoMembershipModel";
import { MongoBaseRepository } from "./MongoBaseRepository";

export class MembershipRepository extends MongoBaseRepository<Membership, MembershipDocument> implements IMembershipRepository {
  constructor() {
    super(MembershipModel);
  }

  protected mapToEntity(doc: MembershipDocument): Membership {
    return new Membership(
      doc.membershipId,
      doc.userId,
      doc.workspaceId,
      doc.role,
      doc.joinedAt
    );
  }

  async create(membership: Membership): Promise<Membership> {
    const membershipDoc = {
      membershipId: membership.membershipId,
      userId: membership.userId,
      workspaceId: membership.workspaceId,
      role: membership.role,
      joinedAt: membership.joinedAt,
    };
    return super.create(membershipDoc);
  }
}