import { ICreateWorkspaceUseCase } from "@/application/interfaces/use-cases/workspace/ICreateWorkspaceUseCase";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { Workspace } from "@/domain/entities/Workspace";
import { Membership } from "@/domain/entities/Membership";
import { Subscription } from "@/domain/entities/Subscription";
import { SubscriptionStatus } from "@/shared/enums/SubscriptionStatus";
import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";

export class CreateWorkspaceUseCase implements ICreateWorkspaceUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _subscriptionRepo: ISubscriptionRepository,
    private readonly _uidGenerator: IUidGenerator
  ) {}

  async execute(
    userId: string,
    workspaceName: string,
    planId?: string
  ): Promise<{ workspaceId: string }> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND
      );
    }

    const existingWorkspace = await this._workspaceRepo.findByName(workspaceName.trim());
    if (existingWorkspace) {
      throw new AppError(
        ErrorCode.CONFLICT,
        AppMessages.WORKSPACE_NAME_ALREADY_EXISTS,
        HttpStatusCode.CONFLICT
      );
    }

    const ownedWorkspace = await this._workspaceRepo.findByOwnerId(userId);
    if (ownedWorkspace) {
      throw new AppError(
        ErrorCode.CONFLICT,
        AppMessages.WORKSPACE_ALREADY_OWNED,
        HttpStatusCode.CONFLICT
      );
    }

    let defaultPlanId = planId;
    let planAmount = 0;
    if (!defaultPlanId) {
        const plans = await this._planRepo.findAll();
        const freePlan = plans.find(p => p.priceMonthly === 0 && p.isActive);
        if (freePlan) {
            defaultPlanId = freePlan.planId!;
            planAmount = freePlan.priceMonthly;
        } else if (plans.length > 0) {
            defaultPlanId = plans[0].planId!;
            planAmount = plans[0].priceMonthly;
        } else {
             throw new AppError(
                ErrorCode.PLAN,
                AppMessages.NO_ACTIVE_PLANS,
                HttpStatusCode.INTERNAL_SERVER_ERROR
             );
        }
    } else {
        const plan = await this._planRepo.findById(defaultPlanId);
        if (!plan || !plan.isActive) {
            throw new AppError(
                ErrorCode.PLAN,
                AppMessages.PLAN_NOT_FOUND,
                HttpStatusCode.BAD_REQUEST
            );
        }
        planAmount = plan.priceMonthly;
    }

    const now = new Date();
    
    const planExpireDate = new Date();
    planExpireDate.setMonth(now.getMonth() + 1);

    // Create new workspace
    const workspace = new Workspace(
        this._uidGenerator.createId(),
        workspaceName.trim(),
        userId,
        defaultPlanId,
        now,
        now,
        false,
        planExpireDate
    );
    const createdWorkspace = await this._workspaceRepo.create(workspace);

    // Create Subscription
    const subscription = new Subscription(
        this._uidGenerator.createId(),
        createdWorkspace.workspaceId!,
        defaultPlanId,
        SubscriptionStatus.ACTIVE,
        now,
        planExpireDate,
        "monthly",
        planAmount,
        "INR"
    );
    await this._subscriptionRepo.create(subscription);

    const membership = new Membership(
        this._uidGenerator.createId(),
        userId,
        createdWorkspace.workspaceId!,
        WorkspaceRoleEnum.WORKSPACE_OWNER,
        now
    );
    await this._membershipRepo.create(membership);

    user.currentWorkspaceId = createdWorkspace.workspaceId;
    await this._userRepo.update(user);

    return { workspaceId: createdWorkspace.workspaceId! };
  }
}
