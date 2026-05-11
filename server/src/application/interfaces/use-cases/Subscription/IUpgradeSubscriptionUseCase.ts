import { UpgradeSubscriptionDto } from "@/application/use-cases/Subscription/UpgradeSubscriptionUseCase";

export interface IUpgradeSubscriptionUseCase {
  execute(dto: UpgradeSubscriptionDto): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    planId: string;
  }>;
}
