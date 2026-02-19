import { Membership } from "@/domain/entities/Membership";


export interface IMembershipRepository {
  create(membership: Membership): Promise<Membership>;
}