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

export class CreateWorkspaceUseCase implements ICreateWorkspaceUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _planRepo: IPlanRepository,
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

    let defaultPlanId = planId;
    if (!defaultPlanId) {
        const plans = await this._planRepo.findAll();
        const freePlan = plans.find(p => p.priceMonthly === 0 && p.isActive);
        if (freePlan) {
            defaultPlanId = freePlan.planId!;
        } else if (plans.length > 0) {
            defaultPlanId = plans[0].planId!;
        } else {
             throw new AppError(
                ErrorCode.PLAN,
                "No active pricing plans available to assign to the new workspace.",
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
    }

    const now = new Date();
    
    // Create new workspace
    const workspace = new Workspace(
        this._uidGenerator.createId(),
        workspaceName.trim(),
        userId,
        defaultPlanId,
        now,
        now
    );
    const createdWorkspace = await this._workspaceRepo.create(workspace);

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
