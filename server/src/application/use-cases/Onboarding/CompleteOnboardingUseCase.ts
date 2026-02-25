import { CompleteOnboardingDto } from "@/application/dtos/CompleteOnboardingDto";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ICompleteOnboardingUseCase } from "@/application/interfaces/use-cases/Onboarding/ICompleteOnboardingUseCase";
import { Membership } from "@/domain/entities/Membership";
import { Workspace } from "@/domain/entities/Workspace";
import {
  AppError,
  AppMessages,
  ErrorCode,
  HttpStatusCode,
  WorkspaceRoleEnum,
} from "shared";

export class CompleteOnboardingUseCase implements ICompleteOnboardingUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _workspaceRepo: IWorkspaceRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _uidGenerator: IUidGenerator
  ) { }

  async execute(
    dto: CompleteOnboardingDto,
  ): Promise<{ workspaceId: string }> {
    const { userId, workspaceName, planId } = dto;

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

    const plan = await this._planRepo.findById(planId);

    if (!plan || !plan.isActive) {
      throw new AppError(
        ErrorCode.PLAN,
        AppMessages.PLAN_NOT_FOUND,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const now = new Date();

    const workspace = new Workspace(
      this._uidGenerator.createId(),
      workspaceName.trim(),
      userId,
      planId,
      now,
      now,
    );

    const createdWorkspace = await this._workspaceRepo.create(workspace);

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

    return { workspaceId: createdWorkspace.workspaceId };
  }
}
