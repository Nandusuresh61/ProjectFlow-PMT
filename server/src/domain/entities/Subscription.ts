import { SubscriptionStatus } from "@/shared/enums/SubscriptionStatus";

export class Subscription {
  constructor(
    public readonly subscriptionId: string | undefined,
    public workspaceId: string,
    public planId: string,
    public status: SubscriptionStatus,
    public startDate: Date,
    public endDate: Date,
    public billingCycle: "monthly",
    public amount: number,
    public currency: string,
    public razorpayOrderId?: string,
    public razorpayPaymentId?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE && new Date() < this.endDate;
  }

  isExpired(): boolean {
    return this.status === SubscriptionStatus.EXPIRED || new Date() >= this.endDate;
  }
}
