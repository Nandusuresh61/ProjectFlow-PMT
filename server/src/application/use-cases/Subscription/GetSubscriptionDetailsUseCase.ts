import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

export class GetSubscriptionDetailsUseCase {
  constructor(
    private readonly _subscriptionRepo: ISubscriptionRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _projectRepo: IProjectRepository,
    private readonly _membershipRepo: IMembershipRepository
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

    // Fetch Current Usage
    const projectCount = await this._projectRepo.countByWorkspaceId(workspaceId);
    const memberCount = await this._membershipRepo.countByWorkspace(workspaceId);

    return {
      subscription,
      plan,
      history,
      usage: {
        projects: projectCount,
        members: memberCount
      }
    };
  }
}

