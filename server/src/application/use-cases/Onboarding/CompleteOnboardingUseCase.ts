import { CompleteOnboardingDto } from "@/application/dtos/CompleteOnboardingDto";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { ISubscriptionRepository } from "@/application/interfaces/repositories/ISubscriptionRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ICreateInvitationUseCase } from "@/application/interfaces/use-cases/Invitation/ICreateInvitationUseCase";
import { ICompleteOnboardingUseCase } from "@/application/interfaces/use-cases/Onboarding/ICompleteOnboardingUseCase";
import { Membership } from "@/domain/entities/Membership";
import { Workspace } from "@/domain/entities/Workspace";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { Subscription } from "@/domain/entities/Subscription";
import { SubscriptionStatus } from "@/shared/enums/SubscriptionStatus";
import { PlanType } from "@/shared/enums/PlanType";

export class CompleteOnboardingUseCase implements ICompleteOnboardingUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _subscriptionRepo: ISubscriptionRepository,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _createInvitationUseCase: ICreateInvitationUseCase
  ) { }

  async execute(
    dto: CompleteOnboardingDto,
  ): Promise<{ workspaceId: string }> {
    const { userId, workspaceName } = dto;

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.USER_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const membershipCount = await this._membershipRepo.countByUserId(userId);
    if (membershipCount > 0) {
      throw new AppError(
        ErrorCode.ONBOARDING,
        AppMessages.USER_ALREADY_ONBOARDED,
        HttpStatusCode.CONFLICT,
      );
    }

    const existingWorkspace = await this._workspaceRepo.findByName(workspaceName.trim());
    if (existingWorkspace) {
      throw new AppError(
        ErrorCode.CONFLICT,
        AppMessages.WORKSPACE_NAME_ALREADY_EXISTS,
        HttpStatusCode.CONFLICT,
      );
    }

    const plan = await this._planRepo.findActiveByType(PlanType.FREE);
    
    if (!plan) {
      throw new AppError(
        ErrorCode.PLAN,
        AppMessages.NO_ACTIVE_PLANS,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const now = new Date();
    const planExpireDate = new Date();
    planExpireDate.setFullYear(now.getFullYear() + 100); // Free plan effectively never expires

    const workspace = new Workspace(
      this._uidGenerator.createId(),
      workspaceName.trim(),
      userId,
      plan.planId,
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
      plan.planId,
      SubscriptionStatus.ACTIVE,
      now,
      planExpireDate,
      "monthly"
    );
    await this._subscriptionRepo.create(subscription);

    const membership = new Membership(
      this._uidGenerator.createId(),
      userId,
      createdWorkspace.workspaceId!,
      WorkspaceRoleEnum.WORKSPACE_OWNER,
      now,
    );

    await this._membershipRepo.create(membership);

    user.currentWorkspaceId = createdWorkspace.workspaceId;

    await this._userRepo.update(user);

    if (dto.invites && dto.invites.length > 0) {
      await Promise.all(
        dto.invites.map((invite) =>
          this._createInvitationUseCase.execute({
            workspaceId: createdWorkspace.workspaceId,
            inviterId: userId,
            email: invite.email,
            role: invite.role,
          })
        )
      );
    }

    return { workspaceId: createdWorkspace.workspaceId };
  }
}
