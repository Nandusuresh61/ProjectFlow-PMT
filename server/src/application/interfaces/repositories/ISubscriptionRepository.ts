import { Subscription } from "@/domain/entities/Subscription";

export interface ISubscriptionRepository {
  create(subscription: Subscription): Promise<Subscription>;
  findById(id: string): Promise<Subscription | null>;
  findByWorkspaceId(workspaceId: string): Promise<Subscription | null>;
  update(subscription: Subscription): Promise<Subscription>;
  findExpired(date: Date): Promise<Subscription[]>;
}
