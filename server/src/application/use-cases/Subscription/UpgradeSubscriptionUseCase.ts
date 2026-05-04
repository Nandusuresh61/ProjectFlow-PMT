import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IPaymentService } from "@/application/interfaces/services/IPaymentService";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export interface UpgradeSubscriptionDto {
  workspaceId: string;
  planId: string;
}

export class UpgradeSubscriptionUseCase {
  constructor(
    private readonly _subscriptionRepo: ISubscriptionRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _paymentService: IPaymentService
  ) {}

  async execute(dto: UpgradeSubscriptionDto) {
    const plan = await this._planRepo.findById(dto.planId);
    if (!plan || !plan.isActive) {
      throw new AppError(ErrorCode.PLAN, AppMessages.PLAN_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const currentSubscription = await this._subscriptionRepo.findByWorkspaceId(dto.workspaceId);
    if (!currentSubscription) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Subscription not found", HttpStatusCode.NOT_FOUND);
    }

    // Create Razorpay Order
    const order = await this._paymentService.createOrder(
      plan.priceMonthly,
      "INR",
      `rcpt_${currentSubscription.subscriptionId?.slice(-30)}`
    );

    // Update subscription with pending order
    currentSubscription.razorpayOrderId = order.id;
    await this._subscriptionRepo.update(currentSubscription);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: plan.planId,
    };
  }
}
