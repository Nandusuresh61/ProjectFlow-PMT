import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IPaymentService } from "@/application/interfaces/services/IPaymentService";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { Subscription } from "@/domain/entities/Subscription";
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
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _paymentService: IPaymentService,
    private readonly _uidGenerator: IUidGenerator
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

    const currentSubscription = await this._subscriptionRepo.findByWorkspaceId(dto.workspaceId);
    if (!currentSubscription) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Subscription not found", HttpStatusCode.NOT_FOUND);
    }

    const plan = await this._planRepo.findById(dto.planId);
    if (!plan) {
      throw new AppError(ErrorCode.PLAN, "Plan not found", HttpStatusCode.NOT_FOUND);
    }

    const workspace = await this._workspaceRepo.findById(dto.workspaceId);
    if (!workspace) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Workspace not found", HttpStatusCode.NOT_FOUND);
    }

    // Mark current active subscription as expired if it exists and is different
    if (currentSubscription.planId !== dto.planId && currentSubscription.status === SubscriptionStatus.ACTIVE) {
        currentSubscription.status = SubscriptionStatus.EXPIRED;
        await this._subscriptionRepo.update(currentSubscription);
    }

    // Create New Subscription Record
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(now.getMonth() + 1);

    const newSubscription = new Subscription(
      this._uidGenerator.createId(),
      dto.workspaceId,
      dto.planId,
      SubscriptionStatus.ACTIVE,
      now,
      endDate,
      "monthly",
      plan.priceMonthly,
      "INR",
      dto.razorpayOrderId,
      dto.razorpayPaymentId
    );

    await this._subscriptionRepo.create(newSubscription);

    // Update Workspace
    workspace.planId = dto.planId;
    workspace.planExpireDate = endDate;
    await this._workspaceRepo.update(workspace);

    return newSubscription;
  }
}
