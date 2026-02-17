import { Membership } from "@/domain/entities/membership/Membership";


export interface IMembershipRepository {
  create(membership: Membership): Promise<Membership>;
}