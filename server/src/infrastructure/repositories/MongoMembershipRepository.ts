import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { Membership } from "@/domain/entities/membership/Membership";
import { MembershipModel } from "../database/models/MongoMembershipModel";

export class MembershipRepository implements IMembershipRepository {

  async create(membership: Membership): Promise<Membership> {
    const created = await MembershipModel.create({
      membershipId: membership.membershipId,
      userId: membership.userId,
      workspaceId: membership.workspaceId,
      role: membership.role,
      joinedAt: membership.joinedAt,
    });

    return new Membership(
      created.membershipId,
      created.userId,
      created.workspaceId,
      created.role,
      created.joinedAt
    );
  }

}