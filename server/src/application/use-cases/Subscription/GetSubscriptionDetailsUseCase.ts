import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class GetSubscriptionDetailsUseCase {
  constructor(
    private readonly _subscriptionRepo: ISubscriptionRepository,
    private readonly _planRepo: IPlanRepository
  ) {}

  async execute(workspaceId: string) {
    const subscription = await this._subscriptionRepo.findByWorkspaceId(workspaceId);
    if (!subscription) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Subscription not found", HttpStatusCode.NOT_FOUND);
    }

    const plan = await this._planRepo.findById(subscription.planId);
    
    // Fetch History
    const allSubscriptions = await this._subscriptionRepo.findAllByWorkspaceId(workspaceId);
    const allPlans = await this._planRepo.findAll();
    
    const history = allSubscriptions.map(sub => {
      const subPlan = allPlans.find(p => p.planId === sub.planId);
      return {
        ...sub,
        planType: subPlan?.type || "Unknown"
      };
    });

    return {
      subscription,
      plan,
      history
    };
  }
}
