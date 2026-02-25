import { Membership } from "@/domain/entities/Membership";

export interface IMembershipRepository {
  create(membership: Membership): Promise<Membership>;
  findByUserAndWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<Membership | null>;
  countByWorkspace(workspaceId: string): Promise<number>;
  countByUserId(userId: string): Promise<number>;
  findByWorkspace(workspaceId: string): Promise<Membership[]>;
}
