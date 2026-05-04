import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IPaymentService } from "@/application/interfaces/services/IPaymentService";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { SubscriptionStatus } from "@/shared/enums/SubscriptionStatus";

export interface VerifyPaymentDto {
  workspaceId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  planId: string;
}

export class VerifyPaymentUseCase {
  constructor(
    private readonly _subscriptionRepo: ISubscriptionRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _paymentService: IPaymentService
  ) {}

  async execute(dto: VerifyPaymentDto) {
    const isValid = await this._paymentService.verifyPayment(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature
    );

    if (!isValid) {
      throw new AppError(ErrorCode.AUTH, "Invalid payment signature", HttpStatusCode.BAD_REQUEST);
    }

    const subscription = await this._subscriptionRepo.findByWorkspaceId(dto.workspaceId);
    if (!subscription) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Subscription not found", HttpStatusCode.NOT_FOUND);
    }

    const plan = await this._planRepo.findById(dto.planId);
    if (!plan) {
      throw new AppError(ErrorCode.PLAN, "Plan not found", HttpStatusCode.NOT_FOUND);
    }

    // Update Subscription
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(now.getMonth() + 1);

    subscription.planId = dto.planId;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.startDate = now;
    subscription.endDate = endDate;
    subscription.razorpayPaymentId = dto.razorpayPaymentId;
    subscription.razorpayOrderId = dto.razorpayOrderId;

    await this._subscriptionRepo.update(subscription);

    return subscription;
  }
}
