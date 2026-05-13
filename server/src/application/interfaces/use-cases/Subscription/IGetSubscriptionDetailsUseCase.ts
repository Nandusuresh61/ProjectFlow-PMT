import { Subscription } from "@/domain/entities/Subscription";
import { Plan } from "@/domain/entities/Plan";
import { SubscriptionStatus } from "@/shared/enums/SubscriptionStatus";

export interface SubscriptionHistoryEntry {
  subscriptionId: string | undefined;
  workspaceId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  billingCycle: "monthly";
  amount: number;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  planType: string;
}

export interface IGetSubscriptionDetailsUseCase {
  execute(workspaceId: string): Promise<{
    subscription: Subscription;
    plan: Plan | null;
    history: SubscriptionHistoryEntry[];
    usage: {
      projects: number;
      members: number;
    };
  }>;
}
